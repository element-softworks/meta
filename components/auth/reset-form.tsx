'use client';

import { login } from '@/actions/login';
import { useQuery } from '@/hooks/useQuery';
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

type ResetFormProps = z.infer<typeof ResetSchema>;

type ResetResponse = {};

export function ResetForm() {
	const {
		query: resetQuery,
		isLoading,
		data,
	} = useQuery<ResetFormProps, ResetResponse>({
		queryFn: async (values) => await reset(values!),
	});

	const form = useForm<ResetFormProps>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	console.log(data, 'data');

	async function onSubmit(values: ResetFormProps) {
		if (!values) return;
		resetQuery(values);
		console.log(values);
	}

	return (
		<div className="">
			<Card className="min-w-96">
				<CardHeader>
					<CardTitle>Forgot your password?</CardTitle>
					<CardDescription>Reset password form</CardDescription>
				</CardHeader>
				<CardContent>
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

							<div>
								<Button size="sm" variant="link" asChild className="px-0">
									<Link href="/auth/login">Back to login</Link>
								</Button>

								<Button className="w-full" type="submit" disabled={isLoading}>
									Send email reset
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
