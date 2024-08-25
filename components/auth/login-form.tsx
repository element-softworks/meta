'use client';

import { login } from '@/actions/login';
import { useQuery } from '@/hooks/useQuery';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { FormInput } from './form-input';
import { Social } from './social';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type LoginFormProps = z.infer<typeof LoginSchema>;

type LoginResponse = {
	twoFactor?: boolean;
};

export function LoginForm() {
	const [showTwoFactor, setShowTwoFactor] = useState(false);

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
		data: loginData,
	} = useQuery<LoginFormProps, LoginResponse>({
		queryFn: async (values) => await login(values!, showTwoFactor),
		onCompleted: (data) => {
			//If the user entered the incorrect details after 2fa, send back to login details
			if (
				data?.error === 'Invalid credentials, check your email and password and try again.'
			) {
				setShowTwoFactor(false);
				form.setValue('code', '');
			}

			//If the user has two-factor enabled, show the two-factor form
			if (data?.twoFactor && !showTwoFactor) {
				setShowTwoFactor(true);
			}
		},
	});

	const form = useForm<LoginFormProps>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			code: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginFormProps) {
		if (!values) return;
		const response = await loginQuery(values);
		console.log(response, 'response data');
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
							{showTwoFactor && (
								<>
									<FormInput
										name="code"
										label="Code"
										render={({ field }) => (
											<Input
												{...field}
												disabled={isLoading}
												placeholder="123456"
											/>
										)}
									/>
								</>
							)}

							{!showTwoFactor && (
								<>
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

									<FormInput
										name="password"
										label="Password"
										render={({ field }) => (
											<Input
												{...field}
												disabled={isLoading}
												type="password"
												placeholder="******"
											/>
										)}
									/>
								</>
							)}
							<div>
								<Button size="sm" variant="link" asChild className="px-0">
									<Link href="/auth/reset">Forgot password</Link>
								</Button>

								<Button disabled={isLoading} className="w-full" type="submit">
									{showTwoFactor ? 'Confirm' : 'Login'}
								</Button>
							</div>
						</form>
					</Form>
					<Social className="mt-2" />
				</CardContent>
			</Card>
		</div>
	);
}
