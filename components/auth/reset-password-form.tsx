'use client';

import { resetPasswordLoggedin } from '@/actions/account/reset-password-loggedin';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { PasswordInput } from '../inputs/password-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';

type ResetPasswordFormInputProps = z.infer<typeof ResetPasswordSchema>;

type ResetPasswordResponse = {};

interface ResetPasswordFormProps {
	disableSeparator?: boolean;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
	const { disableSeparator = false } = props;
	const user = useCurrentUser();

	const { update } = useSession();

	const form = useForm<ResetPasswordFormInputProps>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			newPassword: '',
		},
	});

	const { query: ResetPasswordQuery, isLoading } = useMutation<
		ResetPasswordFormInputProps,
		ResetPasswordResponse
	>({
		queryFn: async (values) => await resetPasswordLoggedin(values!),
		onCompleted: (data) => {
			update();
		},
		onSuccess: () => {
			form.reset();
		},
	});

	async function onSubmit(values: ResetPasswordFormInputProps) {
		if (!values) return;
		const response = await ResetPasswordQuery(values);
	}

	return (
		<>
			{!disableSeparator ? <Separator /> : null}

			<div className="relative">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<PasswordInput
							isLoading={isLoading}
							name="password"
							label="Current password"
							disabled={!!user?.isOAuth}
						/>

						<PasswordInput
							isLoading={isLoading}
							name="newPassword"
							label="Current password"
							disabled={!!user?.isOAuth}
						/>

						<Button
							type="submit"
							isLoading={isLoading}
							disabled={
								isLoading || !user || !form.formState.isDirty || !!user?.isOAuth
							}
						>
							Change password
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
}
