'use client';

import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Social } from './social';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormInput } from './form-input';

export function LoginForm() {
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: z.infer<typeof LoginSchema>) {
		console.log(values);
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
								render={({ field }) => <Input placeholder="" {...field} />}
							/>

							<FormInput
								name="password"
								label="Password"
								render={({ field }) => (
									<Input type="password" placeholder="" {...field} />
								)}
							/>

							<Button className="w-full" type="submit">
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
