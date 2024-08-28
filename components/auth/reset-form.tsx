'use client';

import { login } from '@/actions/login';
import { useQuery } from '@/hooks/use-query';
import { LoginSchema, ResetSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { reset } from '@/actions/reset';
import { Social } from './social';

type ResetFormProps = z.infer<typeof ResetSchema>;

type ResetResponse = {};

export function ResetForm() {
	const {
		query: resetQuery,
		isLoading,
		data,
	} = useQuery<ResetFormProps, ResetResponse>({
		queryFn: async (values) => await reset(values!),
		onCompleted: (data) => {
			form.reset();
		},
	});

	const form = useForm<ResetFormProps>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: ResetFormProps) {
		if (!values) return;
		await resetQuery(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4 ">
				<h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
				<p className="text-sm text-muted-foreground">
					Enter your account email to start your password reset
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						name="email"
						label="Email"
						render={({ field }) => (
							<Input
								{...field}
								disabled={isLoading}
								placeholder="john.doe@example.com"
							/>
						)}
					/>

					<Button className="w-full" type="submit" isLoading={isLoading}>
						Send password reset
					</Button>
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

			<p className="px-8 text-center text-sm text-muted-foreground">
				Remember your details?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/login">Login now</Link>
				</Button>
			</p>
		</div>
	);
}
