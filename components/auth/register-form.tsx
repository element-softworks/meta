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

export function RegisterForm() {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
		},
	});

	async function onSubmit(values: z.infer<typeof RegisterSchema>) {
		startTransition(async () => {
			const response = await register(values);

			toast({
				description: response.error || response.success,
				variant: !!response.error ? 'destructive' : 'default',
			});
		});
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
									<Input {...field} disabled={isPending} placeholder="" />
								)}
							/>
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input {...field} disabled={isPending} placeholder="" />
								)}
							/>

							<FormInput
								name="password"
								label="Password"
								render={({ field }) => (
									<Input
										{...field}
										disabled={isPending}
										placeholder=""
										type="password"
									/>
								)}
							/>

							<Button disabled={isPending} className="w-full" type="submit">
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
