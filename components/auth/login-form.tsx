'use client';

import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { Social } from './social';
import { login } from '@/actions/login';
import { toast } from '../ui/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@/hooks/useQuery';

type LoginFormProps = z.infer<typeof LoginSchema>;

type LoginResponse = { details: string };

export function LoginForm() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const urlError =
		searchParams.get('error') === 'OAuthAccountNotLinked'
			? 'Email already in use with another account'
			: '';

	if (urlError) {
		toast({
			description: urlError,
			variant: 'destructive',
		});
		router.replace('/auth/login');
	}

	const {
		query: loginQuery,
		isLoading,
		data,
	} = useQuery<LoginFormProps, LoginResponse>({
		queryFn: (values) => login(values!),
	});

	const form = useForm<LoginFormProps>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginFormProps) {
		if (!values) return;
		await loginQuery(values);
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Login form</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input disabled={isLoading} placeholder="" {...field} />
								)}
							/>

							<FormInput
								name="password"
								label="Password"
								render={({ field }) => (
									<Input
										disabled={isLoading}
										type="password"
										placeholder=""
										{...field}
									/>
								)}
							/>

							<Button disabled={isLoading} className="w-full" type="submit">
								Login
							</Button>
						</form>
					</Form>
					<Social className="mt-2" />
				</CardContent>
			</Card>
		</div>
	);
}
