'use client';

import { OpeningTimesInput } from '@/components/inputs/opening-times-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../../auth/form-input';
import { DropzoneInput } from '../../inputs/dropzone-input';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { Input } from '../../ui/input';
import { ArrowRight } from 'lucide-react';
import { StoreDetailsSchema } from '@/schemas';
import { Store } from '@/db/drizzle/schema/store';
import { StoresFormInputProps } from './stores-form';

export type StoreDetailsInputProps = z.infer<typeof StoreDetailsSchema>;

interface StoreDetailsStepProps {
	isEditing?: boolean;
	editingStore?: Store | null;
	onSubmit: (values: StoreDetailsInputProps) => void;
	isLoading: boolean;
}

export function StoreDetailsStep(props: StoreDetailsStepProps) {
	const form = useForm<StoreDetailsInputProps>({
		resolver: zodResolver(StoreDetailsSchema),
		defaultValues: { ...detailsStepDefaultValues(props.editingStore) },
	});

	const parentForm = useFormContext<StoresFormInputProps>();

	async function onSubmit(values: StoreDetailsInputProps) {
		props.onSubmit(values);
	}

	return (
		<div className="h-full">
			<div className="space-y-4 h-full">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 h-full flex flex-col "
					>
						<FormInput
							required
							name="name"
							label="Name"
							render={({ field }) => <Input {...field} disabled={props.isLoading} />}
						/>

						<FormInput
							name="contactEmail"
							label="Contact Email"
							render={({ field }) => <Input {...field} disabled={props.isLoading} />}
						/>

						<FormInput
							name="contactPhone"
							label="Contact Phone"
							render={({ field }) => <Input {...field} disabled={props.isLoading} />}
						/>

						<FormInput
							required
							name="maxCapacity"
							label="Store Capacity"
							render={({ field }) => (
								<Input {...field} type="number" disabled={props.isLoading} />
							)}
						/>

						<DropzoneInput
							required
							label="Image"
							name="image"
							defaultFiles={
								!!props.editingStore?.coverImageAsset || !!parentForm.watch('image')
									? [
											props.editingStore?.coverImageAsset ??
												(parentForm.watch().image?.[0] as any),
									  ]
									: undefined
							}
						/>

						<OpeningTimesInput label="Opening times" />

						<div className="!mt-auto ">
							<Button
								onClick={form.handleSubmit(onSubmit)}
								className="w-full mt-4"
								isLoading={props.isLoading}
							>
								Next
								<ArrowRight size={20} className="ml-2" />
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}

export const formatTimeValue = (time: number[]) => {
	const format = (time: number) => {
		const hours = Number(String(time)?.split('.')?.[0]);
		const minutes = Number(String(time)?.split('.')?.[1]) * 0.6 * 10;

		const formattedHours =
			hours > 12
				? hours < 10
					? `0${hours - 12}`
					: hours - 12 < 10
					? `0${hours - 12}`
					: hours - 12
				: hours < 10
				? `0${hours}`
				: hours;
		const formattedMinutes = !!minutes ? (minutes < 10 ? `0${minutes}` : minutes) : '00';
		const timeData = `${formattedHours}:${formattedMinutes}`;

		return timeData;
	};

	if (time?.[0] === 0 || time?.[1] === 0) return [];

	const formattedTime = time?.map((time) => {
		const formatted = format(time);
		const period = time > 12 ? 'pm' : 'am';
		return { time: formatted, period };
	});

	return formattedTime;
};

export const detailsStepDefaultValues = (store?: Store | null) => {
	const methods = useFormContext<StoreDetailsInputProps>();
	const parentForm = useFormContext<StoresFormInputProps>();

	const { getValues, watch } = methods || {};

	return {
		name: getValues?.('name') ?? store?.name ?? '',
		contactEmail: getValues?.('contactEmail') ?? store?.contactEmail ?? '',
		contactPhone: getValues?.('contactPhone') ?? store?.contactPhone ?? '',
		maxCapacity: getValues?.('maxCapacity') ?? store?.maxCapacity ?? '',
		openingTimes: getValues?.('openingTimes') ?? [
			!!(store as any)?.openingTimes?.[0]
				? formatTimeValue((store as any)?.openingTimes?.[0]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[1]
				? formatTimeValue((store as any)?.openingTimes?.[1]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[2]
				? formatTimeValue((store as any)?.openingTimes?.[2]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[3]
				? formatTimeValue((store as any)?.openingTimes?.[3]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[4]
				? formatTimeValue((store as any)?.openingTimes?.[4]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[5]
				? formatTimeValue((store as any)?.openingTimes?.[5]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
			!!(store as any)?.openingTimes?.[6]
				? formatTimeValue((store as any)?.openingTimes?.[6]?.[0] ?? [])
				: [
						{ time: '09:00', period: 'am' },
						{ time: '05:00', period: 'pm' },
				  ],
		],
		image: (!!store?.coverImageAsset || !!parentForm.watch('image')
			? [parentForm.watch().image?.[0] ?? store?.coverImageAsset]
			: undefined) as FileList | undefined,
	};
};
