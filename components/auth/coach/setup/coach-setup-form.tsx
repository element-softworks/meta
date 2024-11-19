'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CoachSetupDetailsStepSchema, CoachSetupSchema } from '@/schemas';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useFormPersist from 'react-hook-form-persist';
import { DetailsStep } from './details-step';
import { MoreAboutYouStep } from './more-about-you-step';
import { VerificationStep } from './verification-step';

export type CoachSetupFormFormProps = z.infer<typeof CoachSetupSchema>;

export type step = 'details' | 'more-details' | 'verification' | 'next';

interface CoachSetupFormProps {
	searchParams: any;
}

export function CoachSetupForm(props: CoachSetupFormProps) {
	const { watch, setValue, handleSubmit, reset } = useForm<CoachSetupFormFormProps>({
		resolver: zodResolver(CoachSetupSchema),
	});

	useFormPersist('coach-setup-form', {
		watch,
		setValue,
		storage: typeof window !== 'undefined' ? window.localStorage : undefined,
		exclude: ['avatar'],
	});

	async function onSubmit(values: z.infer<typeof CoachSetupSchema>) {
		console.log(values, 'values');
		// await createSetupFormSubmission(values!);
	}

	const [fadeOut, setFadeOut] = useState(false);
	const [step, setStep] = useState<step>(props?.searchParams?.step ?? 'details');
	const router = useRouter();
	const pathname = usePathname();

	const changePageTimer = (step: step, duration: number) => {
		setFadeOut(true);
		setTimeout(() => {
			router.push(`${pathname}?step=${step}`, { scroll: false });
			setStep(step);
			setFadeOut(false);
		}, duration);
	};

	useEffect(() => {
		if (props?.searchParams?.step) {
			setStep(props.searchParams.step);
		}
	}, [props?.searchParams?.step]);

	console.log(watch(), 'form values');

	return (
		<div className="flex flex-col gap-4 mt-14">
			{step === 'details' ? (
				<DetailsStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						setValue('email', values.email);
						setValue('firstName', values.firstName);
						setValue('lastName', values.lastName);
						setValue('password', values.password);
						setValue('agreedToMarketing', values.agreedToMarketing);
						setValue('agreedToTerms', values.agreedToTerms);

						changePageTimer('more-details', 0);
					}}
				/>
			) : null}

			{step === 'more-details' ? (
				<MoreAboutYouStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						setValue('avatar', values.avatar);
						setValue('location', values.location);
						setValue('timezone', values.timezone);
						setValue('yearsExperience', values.yearsExperience);
						setValue('businessName', values.businessName);
						setValue('businessNumber', values.businessName);

						changePageTimer('verification', 0);
					}}
					onBack={() => {
						changePageTimer('details', 0);
					}}
				/>
			) : null}

			{step === 'verification' ? (
				<VerificationStep
					values={watch()}
					fadeOut={fadeOut}
					onSubmit={async (values) => {
						setValue('certificates', values.certificates);
						setValue('hoursExperience', values.hoursExperience);

						changePageTimer('next', 0);
					}}
					onBack={() => {
						changePageTimer('more-details', 0);
					}}
				/>
			) : null}
		</div>
	);
}
