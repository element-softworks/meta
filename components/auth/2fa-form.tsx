'use client';

import { User } from '@/db/drizzle/schema/user';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { ExtendedUser } from '@/next-auth';
import { TwoFactorSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TwoFactorCheckInput } from '../inputs/two-factor-check-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { updateUserTwoFactorPreferences } from '@/actions/account/update-user-two-factor-preference';
import { useEffect } from 'react';

type TwoFactorFormInputProps = z.infer<typeof TwoFactorSchema>;

type TwoFactorResponse = {
	user: ExtendedUser;
};

interface TwoFactorFormProps {
	adminMode?: boolean;
	editingUser?: (User & { isOAuth: boolean }) | null;
}

export function TwoFactorForm(props: TwoFactorFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const formUser = props.adminMode ? props.editingUser : user;

	const form = useForm<TwoFactorFormInputProps>({
		resolver: zodResolver(TwoFactorSchema),
		defaultValues: {
			isTwoFactorEnabled: formUser?.isTwoFactorEnabled ?? undefined,
		},
	});

	const { query: twoFactorQuery, isLoading } = useMutation<
		TwoFactorFormInputProps,
		TwoFactorResponse
	>({
		queryFn: async (values) => await updateUserTwoFactorPreferences(values!, formUser?.id),
		onCompleted: async (data) => {
			//If we are updating our own settings, update the session, if not, update the form
			if (props.adminMode) {
				form.reset({
					isTwoFactorEnabled: data?.user?.isTwoFactorEnabled ?? undefined,
				});
			} else {
				const response = await update((prev: ExtendedUser) => ({ ...prev, ...data }));
				form.reset({
					isTwoFactorEnabled: response?.user?.isTwoFactorEnabled ?? undefined,
				});
			}
		},
	});

	async function onSubmit(values: TwoFactorFormInputProps) {
		if (!values) return;
		const response = await twoFactorQuery(values);
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<TwoFactorCheckInput
							disabled={!!formUser?.isOAuth}
							name="isTwoFactorEnabled"
							isLoading={isLoading}
							onChange={(value) => {
								form.handleSubmit(onSubmit)();
							}}
						/>
					</form>
				</Form>
			</div>
		</div>
	);
}
