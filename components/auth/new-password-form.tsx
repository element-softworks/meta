'use client';

import { login } from '@/actions/login';
import { useQuery } from '@/hooks/useQuery';
import { LoginSchema, NewPasswordSchema, ResetSchema } from '@/schemas';
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
import { useSearchParams } from 'next/navigation';
import { newPassword } from '@/actions/new-password';

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
		queryFn: async (values) => await newPassword(values!, token),
	});

	const form = useForm<NewPasswordProps>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
		},
	});

	console.log(data, 'data');

	async function onSubmit(values: NewPasswordProps) {
		if (!values) return;
		newPasswordQuery(values);
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Reset your password</CardTitle>
					<CardDescription>Enter your new details below</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormInput
								name="password"
								label="New password"
								render={({ field }) => (
									<Input
										{...field}
										disabled={isLoading}
										type="password"
										placeholder="*****"
									/>
								)}
							/>

							<div>
								<Button size="sm" variant="link" asChild className="px-0">
									<Link href="/auth/login">Back to login</Link>
								</Button>

								<Button className="w-full" type="submit" disabled={isLoading}>
									Reset password
								</Button>
							</div>
						</form>
					</Form>
					{/* <Social className="mt-2" /> */}
				</CardContent>
			</Card>
		</div>
	);
}
