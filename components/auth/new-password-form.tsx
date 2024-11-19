'use client';

import { newPasswordFinish } from '@/actions/account/new-password-finish';
import { useMutation } from '@/hooks/use-mutation';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PasswordInput } from '../inputs/password-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Social } from './social';

type NewPasswordProps = z.infer<typeof NewPasswordSchema>;

type NewPasswordResponse = {};

export function NewPasswordForm() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const {
		query: newPasswordQuery,
		isLoading,
		data,
	} = useMutation<NewPasswordProps, NewPasswordResponse>({
		queryFn: async (values) => await newPasswordFinish(values!, token),
		onCompleted: (data) => {
			form.reset();
		},
	});

	const form = useForm<NewPasswordProps>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	});

	async function onSubmit(values: NewPasswordProps) {
		if (!values) return;
		newPasswordQuery(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full">
			<div className="mb-4 ">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
					Reset password
				</h1>
				<p className="text-lg font-normal mt-1">Enter your new password below</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<PasswordInput isLoading={isLoading} name="password" label="New password" />

					<div>
						<Link href="/auth/login">
							<Button size="sm" variant="link" asChild className="px-0">
								Back to login
							</Button>
						</Link>
						<Button className="w-fit" type="submit" isLoading={isLoading}>
							Reset password
						</Button>
					</div>
				</form>
			</Form>

			<div className="relative flex text-sm items-start mt-4">
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
				<span className="bg-primary-foreground -mt-2 px-2 text-muted-foreground">
					or continue with
				</span>
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
			</div>
			<Social className="mt-2" />
		</div>
	);
}
