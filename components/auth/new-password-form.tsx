'use client';

import { newPasswordFinish } from '@/actions/new-password-finish';
import { useQuery } from '@/hooks/use-query';
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
	} = useQuery<NewPasswordProps, NewPasswordResponse>({
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
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4 ">
				<h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
				<p className="text-sm text-muted-foreground">Enter your new password below</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<PasswordInput isLoading={isLoading} name="password" label="New password" />

					<div>
						<Button size="sm" variant="link" asChild className="px-0">
							<Link href="/auth/login">Back to login</Link>
						</Button>

						<Button className="w-full" type="submit" isLoading={isLoading}>
							Reset password
						</Button>
					</div>
				</form>
			</Form>

			<div className="relative mt-2">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t"></span>
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Social className="mt-2" />
		</div>
	);
}
