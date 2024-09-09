'use client';

import { uploadUserAvatar } from '@/actions/upload-user-avatar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { InviteTeamUserSchema, UploadUserAvatarSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from '../auth/form-input';
import { watch } from 'fs';
import { InviteUsersInput } from '../inputs/invite-users-input';
import { inviteUsersToTeam } from '@/actions/invite-users-to-team';

interface InviteUserToTeamFormProps {
	teamId: string;
}

export type InviteTeamUsersFormInputProps = z.infer<typeof InviteTeamUserSchema>;

type InviteUsersResponse = {};

export function InviteUserToTeamForm(props: InviteUserToTeamFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const form = useForm<InviteTeamUsersFormInputProps>({
		resolver: zodResolver(InviteTeamUserSchema),
		defaultValues: {
			users: [
				{
					email: '',
					role: 'USER',
					name: '',
				},
			],
		},
	});

	const { query: InviteUsersQuery, isLoading } = useMutation<
		InviteTeamUsersFormInputProps,
		InviteUsersResponse
	>({
		queryFn: async (values) => await inviteUsersToTeam(values!, props.teamId),
		onCompleted: (data) => {
			form.reset({
				users: [
					{
						email: '',
						role: 'USER',
						name: '',
					},
				],
			});
		},
	});

	async function onSubmit(values: InviteTeamUsersFormInputProps) {
		if (!values) return;

		const response = await InviteUsersQuery(values);
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 flex flex-col"
					>
						<InviteUsersInput name="users" isLoading={isLoading} />
						<Button
							className="ml-auto"
							type="submit"
							isLoading={isLoading}
							disabled={isLoading || !form.formState.isDirty}
						>
							Invite users
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
