'use server';

import { db } from '@/db/drizzle/db';
import { question, store } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { CSVFormatSchema, CSVSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import Papa from 'papaparse';

export const uploadCsv = async (formData: FormData) => {
	const authData = await checkPermissions({ admin: true });

	if (authData?.error) {
		return authData;
	}

	const csv = formData.get('csv') as File;

	if (!csv) {
		return { error: 'There was a problem uploading your CSV, please try again later' };
	}

	try {
		// Read the CSV file content
		const csvContent = await csv.text();

		// Parse the CSV into JSON using PapaParse
		const parsedData = Papa.parse(csvContent, {
			header: true, // Treat the first row as headers
			skipEmptyLines: true, // Skip empty lines
		});

		let log: string[] = [];
		let logErrors: { row: number; errors: string[] }[] = [];
		let logSuccess: { row: number; message: string }[] = [];
		// Validate the parsed data (optional, using CSVSchema)
		//Map over every item inside of the array and check if it matches the schema, if it doesn't push the error message to the errors array

		const validQuestionIds = await db
			.select({
				metaQuestionId: question.metaQuestionId,
			})
			.from(question);

		const validMetaStoreIds = await db.select({ metaStoreId: store.metaStoreId }).from(store);

		parsedData?.data?.map?.(async (item, index) => {
			const isValid = CSVFormatSchema.safeParse(item);
			const errors = isValid?.error?.errors?.map?.(
				(error) => `${error.path} - ${error.message}`
			);

			const isValidQuestionId = validQuestionIds.some(
				(validQuestionId) =>
					validQuestionId.metaQuestionId === isValid?.data?.['Question Id']
			);

			const isValidMetaStoreId = validMetaStoreIds.some(
				(validMetaStoreId) => validMetaStoreId.metaStoreId === isValid?.data?.['Store ID']
			);

			if (!isValid.success || !isValidQuestionId || !isValidMetaStoreId) {
				log?.push(`Row ${index + 2}: ${errors}`);
				logErrors.push({
					row: index + 2,
					errors: [...(errors ?? [])],
				});

				!isValidQuestionId &&
					logErrors[logErrors.length - 1].errors.push('Invalid question ID');
				!isValidMetaStoreId &&
					logErrors[logErrors.length - 1].errors.push('Invalid store ID');
			} else {
				log.push(`Row ${index + 2}: Successfully parsed`);
				logSuccess.push({
					row: index + 2,
					message: 'Successfully parsed',
				});
			}
		});

		if (!logErrors.length) {
			//Operation was successful
		}

		return {
			success: 'CSV analysis complete',
			data: parsedData.data, // Parsed JSON data
			log,
			logErrors,
			logSuccess,
		};
	} catch (error) {
		console.error('Error parsing CSV:', error);
		return { error: 'Failed to parse CSV. Please ensure the file is in the correct format.' };
	}
};

export interface UploadCSVResponse {
	data: any;
	log: string[];
	logErrors: { row: number; errors: string[] }[];
	logSuccess: { row: number; message: string }[];
}
