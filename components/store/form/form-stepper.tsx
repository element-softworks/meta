'use client';

interface FormStepperProps {
	steps: string[];
	active: string;
	className?: string;
}

export function FormStepper(props: FormStepperProps) {
	return (
		<div
			className={`flex gap-2 w-full justify-between relative ${!!props.className?.length ? props.className : ''}`}
		>
			<div className="absolute w-full h-[1px] bg-card top-1/2 left-0 -translate-y-1/2" />

			{props.steps.map((step, index) => {
				const isActive = props.active.toLocaleLowerCase() === step.toLocaleLowerCase();
				return (
					<div
						key={index}
						className={`flex gap-2 items-center bg-sidebar z-20 ${index === props.steps.length - 1 ? '' : 'pr-3'} ${index !== 0 ? 'pl-3' : ''}`}
					>
						<div
							className={`flex items-center justify-center w-6 lg:w-8 h-6 lg:h-8 bg-card rounded-full ${isActive ? '' : 'bg-sidebar border-2 border-card'}`}
						>
							{index + 1}
						</div>
						<p className="font-medium text-sm lg:text-base">{step}</p>
					</div>
				);
			})}
		</div>
	);
}
