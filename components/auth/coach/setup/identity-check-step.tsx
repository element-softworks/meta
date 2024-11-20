'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { CertificateDropzoneInput } from '@/components/inputs/certificate-dropzone-input';
import { Button } from '@/components/ui/button';
import { Form, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { VerificationStepSchema } from '@/schemas';
import { FileCheck2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { FormInput } from '../../form-input';
import { CoachSetupFormFormProps } from './coach-setup-form';

interface IdentityCheckStepProps {
	fadeOut: boolean;
	onSubmit: () => void;
	onBack: () => void;
	values: CoachSetupFormFormProps;
}

export function IdentityCheckStep(props: IdentityCheckStepProps) {
	console.log(props.values, 'more about step values data');

	async function onSubmit() {
		props.onSubmit();
	}

	return (
		<div className="flex flex-col gap-4 max-w-full mb-16 sm:mb-4 mt-auto">
			<Button variant="secondary" className="w-fit" onClick={props.onBack}>
				Back
			</Button>
			<div className="space-y-4">
				<div>
					<p className="text-sm font-sans font-normal mb-2">Sign up progress</p>
					<Progress value={78} className="" />
				</div>
				<div className="w-full flex flex-col gap-2">
					<h1 className="text-4xl md:text-5xl font-semibold tracking-tight font-display">
						identify check
					</h1>

					<p className="text-lg font-display">
						The final step is ID verification. This is a secure step using veriff.com
						and is not stored on our servers. Veriff will notify us automatically once
						your ID is verified.
					</p>

					<div className="mt-0 lg:mt-4 flex flex-col gap-4">
						<Button size="lg" className="w-fit !mt-2" onClick={onSubmit}>
							continue with verify
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
