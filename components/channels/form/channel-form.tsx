'use client';

import { FixtureTypeCategoriesInput } from '@/components/inputs/fixture-type-categories-input';
import { RichTextInput } from '@/components/inputs/rich-text-input';
import { Channel } from '@/db/drizzle/schema/channel';
import { useMutation } from '@/hooks/use-mutation';
import { ChannelSchema, FixtureTypeSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../../auth/form-input';
import { DropzoneInput } from '../../inputs/dropzone-input';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { Input } from '../../ui/input';
import CountrySelect from '@/components/inputs/country-select';
import { createChannel } from '@/actions/channel/create-channel';
import { updateChannel } from '@/actions/channel/update-channel';

export type ChannelFormInputProps = z.infer<typeof ChannelSchema>;

interface ChannelFormProps {
	onComplete?: () => void;
	channel?: Channel;
}

export function ChannelForm(props: ChannelFormProps) {
	const form = useForm<ChannelFormInputProps>({
		resolver: zodResolver(ChannelSchema),
		defaultValues: {
			name: props?.channel?.name ?? '',
			image: (props.channel?.image as any) ?? undefined,
			country: props?.channel?.country ?? '',
		},
	});

	const { query: createChannelQuery, isLoading: isCreating } = useMutation<FormData, {}>({
		queryFn: async (values) => await createChannel(values!),
		onCompleted: async (data) => {
			props.onComplete?.();
			form.reset({
				name: props?.channel?.name ?? '',
				image: (props.channel?.image as any) ?? undefined,
				country: props?.channel?.country ?? '',
			});
		},
	});

	const { query: updateChannelQuery, isLoading: isUpdating } = useMutation<FormData, {}>({
		queryFn: async (values) => await updateChannel(values!),
		onCompleted: async (data) => {
			props.onComplete?.();
			form.reset({
				name: props?.channel?.name ?? '',
				image: (props.channel?.image as any) ?? undefined,
				country: props?.channel?.country ?? '',
			});
		},
	});

	async function onSubmit(values: ChannelFormInputProps) {
		const formData = new FormData();
		const fileInput =
			typeof values.image === 'string' || !values?.image?.length
				? values?.image ?? ''
				: values?.image[0] ?? '';

		console.log(fileInput, 'file input data');
		formData.append('image', fileInput as any);
		formData.append('name', values.name);
		formData.append('country', values.country);

		if (!!props.channel?.id) {
			// Update fixture type
			formData.append('id', props.channel?.id);
			updateChannelQuery(formData);
		} else {
			// Create fixture type
			createChannelQuery(formData);
		}
	}

	console.log(form.watch(), 'form watch data');

	useEffect(() => {
		form.reset({
			name: props?.channel?.name ?? '',
			image: undefined,
			country: props?.channel?.country ?? '',
		});
	}, [props.channel]);

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
							label="Channel name"
							render={({ field }) => (
								<Input
									{...field}
									disabled={isCreating || isUpdating}
									placeholder=""
								/>
							)}
						/>
						<CountrySelect name="country" />
						<DropzoneInput
							label="Image"
							name="image"
							defaultFiles={
								!!props.channel?.image?.length ? [props.channel?.image] : undefined
							}
						/>

						<div className="!mt-auto">
							<Button
								className="mt-4 w-full"
								type="submit"
								isLoading={isCreating || isUpdating}
								disabled={isCreating || isUpdating}
							>
								{!!props.channel ? 'Update' : 'Create'} channel
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
