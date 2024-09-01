'use client';

import { updateUserSettings } from '@/actions/update-user-settings';
import { useQuery } from '@/hooks/use-query';
import { ExtendedUser } from '@/next-auth';
import { SettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TwoFactorCheckInput } from '../inputs/two-factor-check-input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChangeEmailForm } from './change-email-form';
import { FormInput } from './form-input';
import { ResetPasswordForm } from './reset-password-form';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

type SettingsFormInputProps = z.infer<typeof SettingsSchema>;

type SettingsResponse = {
	user: ExtendedUser;
};

interface SettingsFormProps {}

export function SettingsForm(props: SettingsFormProps) {
	const router = useRouter();
	//We do this to guarantee the most recent user version will be available within NextAuth
	const user = useCurrentUser();

	if (!user) {
	}
	const { update } = useSession();

	const form = useForm<SettingsFormInputProps>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name ?? undefined,
			role: user?.role ?? UserRole.USER,
			isTwoFactorEnabled: user?.isTwoFactorEnabled ?? undefined,
		},
	});

	const { query: settingsQuery, isLoading } = useQuery<SettingsFormInputProps, SettingsResponse>({
		queryFn: async (values) => await updateUserSettings(values!),
		onCompleted: async (data) => {
			const response = await update((prev: ExtendedUser) => ({ ...prev, ...data }));
			form.reset({
				isTwoFactorEnabled: response?.user?.isTwoFactorEnabled ?? undefined,
				role: response?.user?.role,
				name: response?.user?.name ?? undefined,
			});
		},
	});

	async function onSubmit(values: SettingsFormInputProps) {
		if (!values) return;
		const response = await settingsQuery(values);
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form className="space-y-4">
						<FormInput
							name="name"
							label="Name"
							render={({ field }) => <Input {...field} disabled={isLoading} />}
						/>

						<TwoFactorCheckInput
							visible={!user?.isOAuth}
							name="isTwoFactorEnabled"
							isLoading={isLoading}
						/>

						<FormInput
							name="role"
							label="Role"
							render={({ field }) => (
								<Select
									disabled={isLoading || user?.role !== UserRole.ADMIN}
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
										<SelectItem value={UserRole.USER}>User</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</form>
				</Form>

				<Button
					isLoading={isLoading}
					disabled={isLoading || !user || !form.formState.isDirty}
					onClick={form.handleSubmit(onSubmit)}
				>
					Save details
				</Button>
			</div>
		</div>
	);
}
