'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import Image from 'next/image';
import { CoachSetupDetailsStepSchema } from '@/schemas';
import { Progress } from '@/components/ui/progress';
import { FormInput } from '../../form-input';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/inputs/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

type MoreAboutYouStepFormProps = z.infer<typeof CoachSetupDetailsStepSchema>;

interface GenderStepProps {
	fadeOut: boolean;
	onSubmit: (values: MoreAboutYouStepFormProps) => void;
}

export function MoreAboutYouStep(props: GenderStepProps) {
	const form = useForm<MoreAboutYouStepFormProps>({
		resolver: zodResolver(CoachSetupDetailsStepSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			password: '',
			agreedToMarketing: false,
			agreedToTerms: false,
		},
	});

	async function onSubmit(values: z.infer<typeof CoachSetupDetailsStepSchema>) {
		props.onSubmit(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full mt-16 sm:mt-4 mb-16 sm:mb-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<p className="text-sm font-body font-normal mb-2">Sign up progress</p>
						<Progress value={25} className="" />
					</div>
					<div className="w-full flex flex-col gap-2">
						<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
							coach sign up
						</h1>

						<p className="text-lg font-display">
							Enter your details to join our platform and begin coaching on our
							platform.
						</p>

						<div className="mt-0 lg:mt-6 flex flex-col gap-4">
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input {...field} placeholder="john.doe@example.com" />
								)}
							/>

							<FormInput
								name="firstName"
								label="First Name"
								render={({ field }) => <Input {...field} placeholder="John" />}
							/>

							<FormInput
								name="lastName"
								label="Last Name"
								render={({ field }) => <Input {...field} placeholder="Doe" />}
							/>

							<PasswordInput isLoading={false} name="password" label="Password" />

							<FormInput
								name="agreedToTerms"
								render={({ field }) => (
									<div className="flex items-center space-x-2">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<label
											htmlFor="terms"
											className="text-sm font-medium !font-body"
										>
											I agree to the{' '}
											<Link href="/terms-of-service">terms & conditions</Link>{' '}
											and <Link href="/privacy-policy">privacy policy</Link>
										</label>
									</div>
								)}
							/>

							<FormInput
								name="agreedToMarketing"
								render={({ field }) => (
									<div className="flex items-center space-x-2">
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
										<label
											htmlFor="terms"
											className="text-sm font-medium !font-body"
										>
											I agree to receive marketing notifications with tips,
											offers and news
										</label>
									</div>
								)}
							/>

							<Button
								size="lg"
								className="w-fit !mt-2"
								onClick={form.handleSubmit(onSubmit)}
							>
								continue
							</Button>
						</div>
						<p className="text-sm font-medium !font-body mt-4">
							Already have an account?{' '}
							<Link className="font-semibold" href="/auth/login">
								Login
							</Link>
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
}
