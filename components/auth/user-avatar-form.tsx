'use client';

import { uploadUserAvatar } from '@/actions/system/upload-user-avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { UploadUserAvatarSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { DropzoneInput } from '../inputs/dropzone-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';

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
		FormData,
		UploadUserAvatarResponse
	>({
		queryFn: async (values) => await uploadUserAvatar(values!),
		onCompleted: (data) => {
			update();

			form.reset();
		},
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
						<DropzoneInput
							label="Avatar"
							name="avatar"
							defaultFiles={!!user?.image?.length ? [user?.image] : undefined}
						/>

						<Button
							type="submit"
							isLoading={isLoading}
							disabled={isLoading || !form.formState.isDirty}
						>
							Save avatar
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
