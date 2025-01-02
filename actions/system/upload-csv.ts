'use server';

import { db } from '@/db/drizzle/db';
import { question } from '@/db/drizzle/schema';
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

		parsedData?.data?.map?.(async (item, index) => {
			const isValid = CSVFormatSchema.safeParse(item);
			console.log(isValid?.error?.errors, 'is valid data');
			const errors = isValid?.error?.errors?.map?.(
				(error) => `${error.path} - ${error.message}`
			);

			const isValidQuestionId = validQuestionIds.some(
				(validQuestionId) =>
					validQuestionId.metaQuestionId === isValid?.data?.['Question Id']
			);

			if (!isValid.success && !isValidQuestionId) {
				log?.push(`Row ${index + 2}: ${errors}`);
				logErrors.push({
					row: index + 2,
					errors: !isValidQuestionId
						? ['Invalid question ID', ...(errors ?? [])]
						: errors ?? [],
				});
			} else {
				log.push(`Row ${index + 2}: Successfully parsed`);
				logSuccess.push({
					row: index + 2,
					message: 'Successfully parsed',
				});
			}
		});

		// console.log(log, 'errors data test');
		// console.log(parsedData.data, 'parsed data response');
		return {
			success: 'CSV uploaded successfully',
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
