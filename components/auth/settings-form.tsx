'use client';

import { settings } from '@/actions/settings';
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
import { FormInput } from './form-input';

type SettingsFormInputProps = z.infer<typeof SettingsSchema>;

type SettingsResponse = {};

interface SettingsFormProps {
	user: ExtendedUser | undefined;
}

export function SettingsForm(props: SettingsFormProps) {
	const { user } = props;
	const { update } = useSession();

	const form = useForm<SettingsFormInputProps>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: user?.name ?? undefined,
			email: user?.email ?? undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role ?? UserRole.USER,
			isTwoFactorEnabled: user?.isTwoFactorEnabled ?? undefined,
		},
	});

	const { query: settingsQuery, isLoading } = useQuery<SettingsFormInputProps, SettingsResponse>({
		queryFn: async (values) => await settings(values!),
		onCompleted: (data) => {
			update();
		},
	});

	async function onSubmit(values: SettingsFormInputProps) {
		if (!values) return;
		const response = await settingsQuery(values);
		console.log(response, 'response data');
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Settings</CardTitle>
					<CardDescription>Update user settings</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormInput
								name="name"
								label="Name"
								render={({ field }) => <Input {...field} disabled={isLoading} />}
							/>
							<FormInput
								visible={!user?.isOAuth}
								name="email"
								label="Email"
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
										disabled={isLoading}
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

							<FormInput
								visible={!user?.isOAuth}
								name="password"
								label="Current password"
								render={({ field }) => (
									<Input {...field} disabled={isLoading} type="password" />
								)}
							/>

							<FormInput
								visible={!user?.isOAuth}
								name="newPassword"
								label="New password"
								render={({ field }) => (
									<Input {...field} disabled={isLoading} type="password" />
								)}
							/>

							<div>
								<Button
									disabled={isLoading || !user}
									className="w-full"
									type="submit"
								>
									Save
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
