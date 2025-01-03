'use client';

import { createChannel } from '@/actions/channel/create-channel';
import { useMutation } from '@/hooks/use-mutation';
import { CSVSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DropzoneInput } from '../inputs/dropzone-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { UploadCSVResponse, uploadCsv } from '@/actions/system/upload-csv';

export type CSVFormInputProps = z.infer<typeof CSVSchema>;

interface CSVFormProps {
	onComplete?: () => void;
}

export function CSVForm(props: CSVFormProps) {
	const form = useForm<CSVFormInputProps>({
		resolver: zodResolver(CSVSchema),
		defaultValues: {
			csv: undefined,
		},
	});

	const {
		query: uploadCSVQuery,
		isLoading: isCreating,
		data,
	} = useMutation<FormData, UploadCSVResponse>({
		queryFn: async (values) => await uploadCsv(values!),
		onCompleted: async (data) => {
			form.reset({ csv: undefined });
		},
	});

	async function onSubmit(values: CSVFormInputProps) {
		const formData = new FormData();
		const fileInput = values?.csv[0];

		formData.append('csv', fileInput as any);
		uploadCSVQuery(formData);
	}

	const errorMessage = !!data?.logErrors ? (
		<div className="text-red-500 flex flex-col gap-2">
			<p className="text-xl font-semibold">
				{data?.logErrors?.length} Errors found in the CSV file. Please fix the errors and
				try again.
			</p>

			{data?.logErrors.map((error, index) => {
				if (error?.errors?.length > 1) {
					return (
						<p>
							Row {error.row}:
							{error.errors.map((err) => (
								<li>{err}</li>
							))}
						</p>
					);
				} else {
					return (
						<p>
							Row {error.row}: {error.errors}
						</p>
					);
				}
			})}
		</div>
	) : null;

	return (
		<div className="h-full">
			{errorMessage}
			<div className="space-y-4h-full h-full">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 h-full flex flex-col"
					>
						<DropzoneInput
							required
							label="CSV"
							name="csv"
							defaultFiles={[]}
							accept={{
								'text/csv': [],
							}}
							placeholder="Drag and drop a csv file here, or click to select."
						/>

						<div className="!mt-auto">
							<Button
								className="mt-4 w-full"
								type="submit"
								isLoading={isCreating}
								disabled={isCreating}
							>
								Upload CSV
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
