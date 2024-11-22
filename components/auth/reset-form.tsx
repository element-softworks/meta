'use client';

import { newPasswordStart } from '@/actions/account/new-password-start';
import { useMutation } from '@/hooks/use-mutation';
import { ResetSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { Social } from './social';
import { ArrowLeft } from 'lucide-react';

type ResetFormProps = z.infer<typeof ResetSchema>;

type ResetResponse = {};

export function ResetForm() {
	const {
		query: resetQuery,
		isLoading,
		data,
	} = useMutation<ResetFormProps, ResetResponse>({
		queryFn: async (values) => await newPasswordStart(values!),
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
		<div className="flex flex-col gap-4 max-w-full">
			<div className="mb-4 ">
				<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
					forgot password
				</h1>
				<p className="text-lg font-normal mt-1">
					Enter your email address and if an account exists we{"'"}ll send a password
					reset form.
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

					<Button className="w-fit" type="submit" isLoading={isLoading}>
						Send password reset
					</Button>
				</form>
			</Form>
			{/* <div className="relative flex text-base items-start mt-4">
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
				<span className="bg-primary-foreground -mt-2 px-2 text-muted-foreground">
					or continue with
				</span>
				<span className="bg-primary-foreground border-t px-3 text-muted-foreground" />
			</div>
			<Social className="mt-2" /> */}

			<Link
				href="/auth/login"
				className="flex items-center gap-1 font-display font-medium text-sm mt-4"
			>
				<ArrowLeft size={20} />
				back to login
			</Link>
		</div>
	);
}
