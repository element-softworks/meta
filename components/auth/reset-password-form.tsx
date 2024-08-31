'use client';

import { emailChangeStart } from '@/actions/change-email-start';
import { useQuery } from '@/hooks/use-query';
import { ExtendedUser } from '@/next-auth';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { resetPasswordLoggedin } from '@/actions/reset-password-loggedin';
import { PasswordInput } from '../inputs/password-input';

type ResetPasswordFormInputProps = z.infer<typeof ResetPasswordSchema>;

type ResetPasswordResponse = {};

interface ResetPasswordFormProps {
	user: ExtendedUser | undefined;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
	const { user } = props;
	const { update } = useSession();

	const form = useForm<ResetPasswordFormInputProps>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			newPassword: '',
		},
	});

	const { query: ResetPasswordQuery, isLoading } = useQuery<
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
		<div className="relative">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<PasswordInput
						isLoading={isLoading}
						name="password"
						label="Current password"
						visible={!user?.isOAuth}
					/>

					<PasswordInput
						isLoading={isLoading}
						name="newPassword"
						label="Current password"
						visible={!user?.isOAuth}
					/>

					<Button
						disabled={isLoading || !user}
						className="w-full"
						onClick={form.handleSubmit(onSubmit)}
					>
						Change password
					</Button>
				</form>
			</Form>
		</div>
	);
}
