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
import { useQuery } from '@/hooks/useQuery';

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
	});

	async function onSubmit(values: z.infer<typeof RegisterSchema>) {
		await registerQuery(values);
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Register</CardTitle>
					<CardDescription>Register form</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormInput
								name="name"
								label="Name"
								render={({ field }) => (
									<Input {...field} disabled={isLoading} placeholder="" />
								)}
							/>
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input {...field} disabled={isLoading} placeholder="" />
								)}
							/>

							<FormInput
								name="password"
								label="Password"
								render={({ field }) => (
									<Input
										{...field}
										disabled={isLoading}
										placeholder=""
										type="password"
									/>
								)}
							/>

							<Button disabled={isLoading} className="w-full" type="submit">
								Register
							</Button>
						</form>
					</Form>
					<Social className="mt-2" />
				</CardContent>
			</Card>
		</div>
	);
}
