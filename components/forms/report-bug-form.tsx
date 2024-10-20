'use client';

import { reportBug } from '@/actions/system/report-bug';
import { useMutation } from '@/hooks/use-mutation';
import { ReportBugSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../auth/form-input';
import { DropzoneInput } from '../inputs/dropzone-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type ReportBugFormInputProps = z.infer<typeof ReportBugSchema>;

interface ReportBugFormProps {
	onSubmit?: () => void;
}

export function ReportBugForm(props: ReportBugFormProps) {
	const form = useForm<ReportBugFormInputProps>({
		resolver: zodResolver(ReportBugSchema),
		defaultValues: {
			title: '',
			description: '',
			status: 'OPEN',
			images: [],
		},
	});

	const { query: createTeamQuery, isLoading: isCreating } = useMutation<FormData, {}>({
		queryFn: async (values) => await reportBug(values!),
		onCompleted: async (data) => {
			form.reset();
			props.onSubmit?.();
		},
	});

	async function onSubmit(values: ReportBugFormInputProps) {
		const formData = new FormData();

		console.log(values, 'values data');

		values?.images?.forEach((image, index) => {
			formData.append(`images.${index}`, image as any);
		});

		formData.append('title', values.title);
		formData.append('description', values.description);
		formData.append('status', values.status);
		createTeamQuery(formData);
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormInput
							name="title"
							label="Title"
							render={({ field }) => (
								<Input {...field} disabled={isCreating} placeholder="Bug title" />
							)}
						/>

						<FormInput
							name="description"
							label="Description"
							render={({ field }) => (
								<Textarea
									{...field}
									rows={8}
									disabled={isCreating}
									placeholder="Describe the bug in detail"
								/>
							)}
						/>

						<DropzoneInput multiple label="Images" name="images" />

						<Button
							type="submit"
							isLoading={isCreating}
							disabled={isCreating || !form.formState.isDirty}
						>
							Report bug
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
