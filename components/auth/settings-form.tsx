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

type SettingsFormInputProps = z.infer<typeof SettingsSchema>;

type SettingsResponse = {
	user: ExtendedUser;
};

interface SettingsFormProps {
	user: ExtendedUser | undefined;
}

export function SettingsForm(props: SettingsFormProps) {
	//We do this to guarantee the most recent user version will be available within NextAuth
	const clientUser = useCurrentUser();
	const { user: serverUser } = props;
	const user = clientUser ?? serverUser;

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
		},
	});

	async function onSubmit(values: SettingsFormInputProps) {
		if (!values) return;
		const response = await settingsQuery(values);
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Settings</CardTitle>
					<CardDescription>Update user settings</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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
						disabled={isLoading || !user}
						className="w-full"
						onClick={form.handleSubmit(onSubmit)}
					>
						Save
					</Button>

					<ChangeEmailForm user={user} />

					<ResetPasswordForm user={user} />
				</CardContent>
			</Card>
		</div>
	);
}
