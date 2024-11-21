'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { FormInput } from '../auth/form-input';
import { Form } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactSchema } from '@/schemas';
import * as z from 'zod';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';

interface ContactProps {
	title: string;
	description?: string;
}

interface FormInputProps {
	name: string;
	email: string;
	message: string;
}

export function Contact(props: ContactProps) {
	const form = useForm<FormInputProps>({
		resolver: zodResolver(ContactSchema),
		defaultValues: {
			name: '',
			email: '',
			message: '',
		},
	});

	async function onSubmit(values: z.infer<typeof ContactSchema>) {
		// await registerQuery(values);
		if (!process.env.NEXT_PUBLIC_FORM_URL) {
			throw new Error('Form URL is not defined, please define it in your .env file');
		}

		const response = await fetch(process.env.NEXT_PUBLIC_FORM_URL, {
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.ok) {
			// Handle successful response
		} else {
			console.log('error');
		}
		form.reset();
	}

	return (
		<section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 relative">
			<Form {...form}>
				<form
					style={{ height: '100%' }}
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-6 order-2 lg:order-1"
				>
					<Card>
						<CardContent className="text-start  p-4 md:p-8 flex flex-col gap-6">
							<div className="flex flex-col">
								<h2 className="w-full font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
									{props.title}
								</h2>
								<p className="text-base md:text-lg text-muted-foreground max-w-[65ch] mb-4 md:mb-8">
									{props.description}
								</p>
							</div>
							<FormInput
								name="name"
								label="Name"
								render={({ field }) => (
									<Input
										{...field}
										disabled={form.formState.isSubmitting}
										placeholder="Your name"
									/>
								)}
							/>
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input
										{...field}
										disabled={form.formState.isSubmitting}
										placeholder="Your email"
									/>
								)}
							/>

							<FormInput
								name="message"
								label="Message"
								render={({ field }) => (
									<Textarea
										{...field}
										rows={8}
										disabled={form.formState.isSubmitting}
										placeholder="Your message"
									/>
								)}
							/>

							{form.formState.isSubmitSuccessful && (
								<p className="text-successful">Message sent successfully</p>
							)}

							<Button
								disabled={form.formState.isSubmitting}
								isLoading={form.formState.isSubmitting}
								className="w-full"
								type="submit"
							>
								Send
							</Button>
						</CardContent>
					</Card>
				</form>
			</Form>

			<div
				className="lg:h-full w-full object-cover rounded-lg  h-60 bg-bottom order-1 lg:order-2 bg-cover bg-black opacity-85"
				style={{
					backgroundImage: `url('/images/auth/auth-layout-image-2.webp')`,
				}}
			/>
		</section>
	);
}
