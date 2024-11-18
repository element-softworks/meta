'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { DropzoneInput } from '@/components/inputs/dropzone-input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import counties from '@/lib/countries.json';
import timezones from '@/lib/timezones.json';
import { VerificationStepSchema } from '@/schemas';
import { FormInput } from '../../form-input';
import { CoachSetupFormFormProps } from './coach-setup-form';
import { useEffect } from 'react';
import Link from 'next/link';
import { FileCheck2, FileUp } from 'lucide-react';

type VerificationStepFormProps = z.infer<typeof VerificationStepSchema>;

interface VerificationStepProps {
	fadeOut: boolean;
	onSubmit: (values: VerificationStepFormProps) => void;
	onBack: () => void;
	values: CoachSetupFormFormProps;
}

export function VerificationStep(props: VerificationStepProps) {
	console.log(props.values, 'more about step values data');
	const form = useForm<VerificationStepFormProps>({
		resolver: zodResolver(VerificationStepSchema),
		defaultValues: {
			certificates: [],
			hoursExperience: '' as any,
		},
	});

	useEffect(() => {
		form.reset({
			certificates: props.values?.certificates ?? [],
			hoursExperience: props.values?.hoursExperience ?? '',
		});
	}, [props.values]);

	async function onSubmit(values: z.infer<typeof VerificationStepSchema>) {
		props.onSubmit(values);
	}

	return (
		<div className="flex flex-col gap-4 max-w-full mb-16 sm:mb-4 mt-auto">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<p className="text-sm font-body font-normal mb-2">Sign up progress</p>
						<Progress value={55} className="" />
					</div>
					<div className="w-full flex flex-col gap-2">
						<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
							verification
						</h1>

						<p className="text-lg font-display">
							We need to verify who you are to safeguard our community in line with
							our{' '}
							<Link href="/terms-of-service" className="font-semibold">
								terms and conditions
							</Link>
						</p>

						<div className="mt-0 lg:mt-6 flex flex-col gap-4">
							<FormInput
								description="We may ask you to verify this"
								name="hoursExperience"
								label="How many hours of coaching experience do you have?"
								render={({ field }) => (
									<Input {...field} type="number" placeholder="100" />
								)}
							/>
							<DropzoneInput
								multiple
								label="Coaching certificates"
								name="certificates"
								placeholder="Drag or drop to upload your certificates PDF/PNG/JPEG Maximum 3MB"
								defaultFiles={props.values.certificates as any}
								icon={<FileCheck2 className="text-muted-foreground" />}
							/>

							<Button
								size="lg"
								className="w-fit !mt-2"
								onClick={form.handleSubmit(onSubmit)}
							>
								next step
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
