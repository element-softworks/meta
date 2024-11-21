'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CoachSetupFormFormProps } from './coach-setup-form';

interface IdentityCheckStepProps {
	fadeOut: boolean;
	onSubmit: () => void;
	onBack: () => void;
	values: CoachSetupFormFormProps;
}

export function IdentityCheckStep(props: IdentityCheckStepProps) {
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
