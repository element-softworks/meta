'use client';

import { adminSendPasswordReset } from '@/actions/admin-send-password-reset';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { ResetPasswordSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
import z from 'zod';
import { Button } from '../ui/button';

type ResetPasswordAdminButtonInputProps = z.infer<typeof ResetPasswordSchema>;

type ResetPasswordAdminResponse = {};

interface ResetPasswordAdminButtonProps {
	disableSeparator?: boolean;
	user: ExtendedUser | null;
}

export function ResetPasswordAdminButton(props: ResetPasswordAdminButtonProps) {
	const currentUser = useCurrentUser();
	const { query: ResetPasswordAdminQuery, isLoading } = useMutation<
		ExtendedUser,
		ResetPasswordAdminResponse
	>({
		queryFn: async (user) => await adminSendPasswordReset(user!),
	});

	async function onSubmit() {
		const response = await ResetPasswordAdminQuery(props.user!);
	}

	if (!(currentUser?.role === UserRole.ADMIN)) return null;
	return (
		<div className="flex gap-2 flex-col">
			<div>
				<p className="text-lg font-bold">Reset users password</p>
				<p className="text-muted-foreground text-sm">
					Send a password reset to {props.user?.email}
				</p>
			</div>
			<Button
				className="w-fit"
				disabled={isLoading}
				isLoading={isLoading}
				onClick={() => onSubmit()}
			>
				Send password reset email
			</Button>
		</div>
	);
}
