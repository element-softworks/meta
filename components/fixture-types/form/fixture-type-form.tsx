'use client';

import { reportBug } from '@/actions/system/report-bug';
import { useMutation } from '@/hooks/use-mutation';
import { FixtureTypeSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../../auth/form-input';
import { DropzoneInput } from '../../inputs/dropzone-input';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { RichTextInput } from '@/components/inputs/rich-text-input';
import { createFixtureType } from '@/actions/fixture-type/create-fixture-type';

type FixtureTypeFormInputProps = z.infer<typeof FixtureTypeSchema>;

interface FixtureTypeFormProps {
	onComplete?: () => void;
}

export function FixtureTypeForm(props: FixtureTypeFormProps) {
	const form = useForm<FixtureTypeFormInputProps>({
		resolver: zodResolver(FixtureTypeSchema),
		defaultValues: {
			name: '',
			images: [],
			description: '',
		},
	});

	const { query: createFixtureTypeQuery, isLoading: isCreating } = useMutation<FormData, {}>({
		queryFn: async (values) => await createFixtureType(values!),
		onCompleted: async (data) => {
			form.reset();
			props.onComplete?.();
		},
	});

	async function onSubmit(values: FixtureTypeFormInputProps) {
		const formData = new FormData();

		values?.images?.forEach((image, index) => {
			formData.append(`images.${index}`, image as any);
		});

		formData.append('name', values.name);
		formData.append('description', values.description);

		createFixtureTypeQuery(formData);
	}

	return (
		<div className="h-full">
			<div className="space-y-4h-full h-full">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 h-full flex flex-col"
					>
						<FormInput
							required
							name="name"
							label="Fixture name"
							render={({ field }) => (
								<Input {...field} disabled={isCreating} placeholder="Bug title" />
							)}
						/>

						<DropzoneInput multiple label="Images" name="images" />

						<RichTextInput name="description" label="Description" />
						<Button
							className="!mt-auto"
							type="submit"
							isLoading={isCreating}
							disabled={isCreating || !form.formState.isDirty}
						>
							Create fixture type
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
