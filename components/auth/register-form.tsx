'use client';

import { register } from '@/actions/register';
import { useMutation } from '@/hooks/use-mutation';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PasswordInput } from '../inputs/password-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { FormInput } from './form-input';
import { Social } from './social';
import { useSearchParams } from 'next/navigation';
import { ConciergeToken } from '@prisma/client';

type RegisterFormFormProps = z.infer<typeof RegisterSchema>;

interface RegisterFormProps {
	token?: ConciergeToken | null;
}

export function RegisterForm(props: RegisterFormProps) {
	const form = useForm<RegisterFormFormProps>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			email: props.token?.email ?? '',
			password: '',
			name: props.token?.name ?? '',
		},
	});

	const { query: registerQuery, isLoading } = useMutation<RegisterFormFormProps, {}>({
		queryFn: async (values) => await register(values!, props?.token),
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
			{!!props.token ? null : (
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
			)}

			{/* We disable social login if the user is invited to the platform as there is no way to
			securely pass data to OAuth providers without exposing vulnerabilities to the platform.
			This is a security measure to prevent unauthorized access teams across platform. */}
			<Social className="mt-2" disabled={!!props.token} />
			<p className="px-8 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/login">Login now</Link>
				</Button>
			</p>
		</div>
	);
}
