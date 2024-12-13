'use client';

import { createFixtureType } from '@/actions/fixture-type/create-fixture-type';
import { updateFixtureType } from '@/actions/fixture-type/update-fixture-type';
import { RichTextInput } from '@/components/inputs/rich-text-input';
import { FixtureType } from '@/db/drizzle/schema/fixtureType';
import { useMutation } from '@/hooks/use-mutation';
import { FixtureTypeSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../../auth/form-input';
import { DropzoneInput } from '../../inputs/dropzone-input';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { Input } from '../../ui/input';
import { FixtureTypeCategoriesInput } from '@/components/inputs/fixture-type-categories-input';
import { FixtureTypesResponse } from '@/actions/fixture-type/get-fixture-types';

export type FixtureTypeFormInputProps = z.infer<typeof FixtureTypeSchema>;

interface FixtureTypeFormProps {
	onComplete?: () => void;
	fixtureType?: FixtureTypesResponse['fixtureTypes'][0];
}

export function FixtureTypeForm(props: FixtureTypeFormProps) {
	console.log(props.fixtureType, 'fixture type data');
	const form = useForm<FixtureTypeFormInputProps>({
		resolver: zodResolver(FixtureTypeSchema),
		defaultValues: {
			name: props.fixtureType?.fixtureType?.name ?? '',
			images: !!props.fixtureType?.fixtureType?.images
				? [...props.fixtureType?.fixtureType?.images]
				: ([] as any),
			description: props.fixtureType?.fixtureType?.description ?? '',
			category: {
				id: props.fixtureType?.category.id ?? '',
				label: props.fixtureType?.category?.name ?? '',
			},
		},
	});

	const { query: createFixtureTypeQuery, isLoading: isCreating } = useMutation<FormData, {}>({
		queryFn: async (values) => await createFixtureType(values!),
		onCompleted: async (data) => {
			props.onComplete?.();
		},
	});

	const { query: updateFixtureTypeQuery, isLoading: isUpdating } = useMutation<FormData, {}>({
		queryFn: async (values) => await updateFixtureType(values!),
		onCompleted: async (data) => {
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
		formData.append('category.id', values.category?.id);
		formData.append('category.label', values.category?.label);

		if (!!props.fixtureType?.fixtureType?.id) {
			// Update fixture type
			formData.append('id', props.fixtureType?.fixtureType?.id);
			updateFixtureTypeQuery(formData);
		} else {
			// Create fixture type
			createFixtureTypeQuery(formData);
		}
	}

	console.log(form.watch(), 'form watch data');

	useEffect(() => {
		form.reset({
			name: props.fixtureType?.fixtureType.name ?? '',
			images: !!props.fixtureType?.fixtureType.images
				? [...props.fixtureType?.fixtureType.images]
				: ([] as any),
			description: props.fixtureType?.fixtureType.description ?? '',
		});
	}, [props.fixtureType]);

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
								<Input
									{...field}
									disabled={isCreating || isUpdating}
									placeholder=""
								/>
							)}
						/>
						<FixtureTypeCategoriesInput name="category" label="Fixture category" />
						<DropzoneInput
							multiple
							label="Images"
							name="images"
							defaultFiles={
								!!props.fixtureType?.fixtureType.images
									? [...props.fixtureType?.fixtureType.images]
									: (undefined as any)
							}
						/>
						<RichTextInput name="description" label="Description" />

						<div className="!mt-auto">
							<Button
								className="mt-4 w-full"
								type="submit"
								isLoading={isCreating || isUpdating}
								disabled={isCreating || !form.formState.isDirty || isUpdating}
							>
								{props.fixtureType ? 'Update' : 'Create'} fixture type
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
