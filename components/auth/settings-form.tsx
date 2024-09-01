'use client';

import { updateUserSettings } from '@/actions/update-user-settings';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { SettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TwoFactorCheckInput } from '../inputs/two-factor-check-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormInput } from './form-input';

type SettingsFormInputProps = z.infer<typeof SettingsSchema>;

type SettingsResponse = {
	user: ExtendedUser;
};

interface SettingsFormProps {
	adminMode?: boolean;
	editingUser?: ExtendedUser | null;
}

export function SettingsForm(props: SettingsFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const formUser = props.adminMode ? props.editingUser : user;

	const form = useForm<SettingsFormInputProps>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			name: formUser?.name ?? undefined,
			role: formUser?.role ?? UserRole.USER,
			isTwoFactorEnabled: formUser?.isTwoFactorEnabled ?? undefined,
		},
	});

	const { query: settingsQuery, isLoading } = useMutation<
		SettingsFormInputProps,
		SettingsResponse
	>({
		queryFn: async (values) => await updateUserSettings(values!, formUser?.id),
		onCompleted: async (data) => {
			//If we are updating our own settings, update the session, if not, update the form
			if (props.adminMode) {
				form.reset({
					isTwoFactorEnabled: data?.user?.isTwoFactorEnabled ?? undefined,
					role: data?.user?.role,
					name: data?.user?.name ?? undefined,
				});
			} else {
				const response = await update((prev: ExtendedUser) => ({ ...prev, ...data }));
				form.reset({
					isTwoFactorEnabled: response?.user?.isTwoFactorEnabled ?? undefined,
					role: response?.user?.role,
					name: response?.user?.name ?? undefined,
				});
			}
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
							visible={!formUser?.isOAuth}
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
					disabled={isLoading || !formUser || !form.formState.isDirty}
					onClick={form.handleSubmit(onSubmit)}
				>
					Save details
				</Button>
			</div>
		</div>
	);
}
