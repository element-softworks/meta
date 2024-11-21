'use client';

import { emailChangeStart } from '@/actions/account/change-email-start';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { ChangeEmailSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { useCurrentUser } from '@/hooks/use-current-user';

type ChangeEmailFormInputProps = z.infer<typeof ChangeEmailSchema>;

type ChangeEmailResponse = {};

interface ChangeEmailFormProps {}

export function ChangeEmailForm(props: ChangeEmailFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const form = useForm<ChangeEmailFormInputProps>({
		resolver: zodResolver(ChangeEmailSchema),
		defaultValues: {
			email: user?.email ?? undefined,
		},
	});

	const { query: changeEmailQuery, isLoading } = useMutation<
		ChangeEmailFormInputProps,
		ChangeEmailResponse
	>({
		queryFn: async (values) => await emailChangeStart(values!),
		onCompleted: (data) => {
			update();
		},
	});

	async function onSubmit(values: ChangeEmailFormInputProps) {
		if (!values) return;
		const response = await changeEmailQuery(values);
	}

	return (
		<div className="relative">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						disabled={!!user?.isOAuth}
						name="email"
						label="Email"
						render={({ field }) => (
							<div className="flex items-center gap-2">
								<Input {...field} disabled={isLoading || !!user?.isOAuth} />
								<Button
									variant="secondary"
									disabled={
										isLoading ||
										!user ||
										!form.formState.isDirty ||
										!!user?.isOAuth
									}
									isLoading={isLoading || !user}
									type="submit"
								>
									Save email
								</Button>
							</div>
						)}
					/>
				</form>
			</Form>
		</div>
	);
}
