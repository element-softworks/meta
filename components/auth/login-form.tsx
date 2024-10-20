'use client';

import { login } from '@/actions/auth/login';
import { useMutation } from '@/hooks/use-mutation';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { FormInput } from './form-input';
import { Social } from './social';
import { PasswordInput } from '../inputs/password-input';

type LoginFormProps = z.infer<typeof LoginSchema>;

type LoginResponse = {
	twoFactor?: boolean;
};

export function LoginForm() {
	const [showTwoFactor, setShowTwoFactor] = useState(false);

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

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

	const { query: loginQuery, isLoading } = useMutation<LoginFormProps, LoginResponse>({
		queryFn: async (values) => await login(values!, showTwoFactor, callbackUrl),
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
	}

	return (
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4 ">
				<h1 className="text-2xl font-semibold tracking-tight">
					{showTwoFactor ? 'Enter 2FA code' : 'Login to your account'}
				</h1>
				<p className="text-sm text-muted-foreground">
					{showTwoFactor
						? 'Enter the two factor code sent to your email address'
						: 'Enter your email and password to login to your account'}
				</p>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					{showTwoFactor && (
						<>
							<FormInput
								name="code"
								render={({ field }) => (
									<Input {...field} disabled={isLoading} placeholder="123456" />
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
							<div>
								<PasswordInput
									isLoading={isLoading}
									name="password"
									label="Password"
								/>
								<Button size="sm" variant="link" asChild className="px-0">
									<Link href="/auth/reset">Forgot password?</Link>
								</Button>
							</div>
						</>
					)}

					<div>
						<Button isLoading={isLoading} className="w-full" type="submit">
							{showTwoFactor ? 'Confirm 2FA code' : 'Login with email'}
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

			<p className="px-8 text-center text-sm text-muted-foreground">
				{"Don't"} have an account yet?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/register">Register now</Link>
				</Button>
			</p>
		</div>
	);
}
