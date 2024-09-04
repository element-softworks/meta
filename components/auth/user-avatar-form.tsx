'use client';

import { uploadUserAvatar } from '@/actions/upload-user-avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { UploadUserAvatarSchema } from '@/schemas';

type UploadUserAvatarFormInputProps = z.infer<typeof UploadUserAvatarSchema>;

type UploadUserAvatarResponse = {};

interface UserAvatarFormProps {
	adminMode?: boolean;
	editingUser?: ExtendedUser | null;
}

export function UserAvatarForm(props: UserAvatarFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const formUser = props.adminMode ? props.editingUser : user;

	const form = useForm<UploadUserAvatarFormInputProps>({
		resolver: zodResolver(UploadUserAvatarSchema),
		defaultValues: {
			avatar: undefined,
		},
	});

	const { query: UploadUserAvatarQuery, isLoading } = useMutation<
		UploadUserAvatarFormInputProps,
		UploadUserAvatarResponse
	>({
		queryFn: async (values) => await uploadUserAvatar(values!),
	});

	async function onSubmit(values: UploadUserAvatarFormInputProps) {
		if (!values) return;

		const formData = new FormData();
		const fileInput = values.avatar[0]; // Assuming avatar is being returned as a FileList
		formData.append('avatar', fileInput);

		const response = await UploadUserAvatarQuery(formData);
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormInput
							name="avatar"
							label="Avatar"
							render={({ field }) => (
								<Input
									name={field.name}
									onBlur={field.onBlur}
									onChange={(e) => {
										field.onChange(e.target.files);
									}}
									disabled={false}
									type="file"
								/>
							)}
						/>

						<Button
							type="submit"
							isLoading={isLoading}
							disabled={isLoading || !form.formState.isDirty}
						>
							Upload file
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
