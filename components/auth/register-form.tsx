'use client';

import { register } from '@/actions/register';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { FormInput } from './form-input';
import { Social } from './social';
import { useQuery } from '@/hooks/use-query';
import { LoaderCircle } from 'lucide-react';
import { PasswordInput } from '../inputs/password-input';
import Link from 'next/link';

type RegisterFormProps = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
	const form = useForm<RegisterFormProps>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	const { query: registerQuery, isLoading } = useQuery<RegisterFormProps, {}>({
		queryFn: async (values) => await register(values!),
		onSuccess: () => {
			form.reset();
		},
	});

	async function onSubmit(values: z.infer<typeof RegisterSchema>) {
		await registerQuery(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4">
				<h1 className="text-2xl font-semibold tracking-tight">Register your account</h1>
				<p className="text-sm text-muted-foreground">
					Enter your details to register to your account
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormInput
						name="name"
						label="Name"
						render={({ field }) => (
							<Input {...field} disabled={isLoading} placeholder="John Doe" />
						)}
					/>
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

					<PasswordInput isLoading={isLoading} name="password" label="Password" />

					<Button isLoading={isLoading} className="w-full" type="submit">
						Register with email
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
				Already have an account?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/login">Login now</Link>
				</Button>
			</p>
		</div>
	);
}
