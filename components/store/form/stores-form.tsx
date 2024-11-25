'use client';

import { useMutation } from '@/hooks/use-mutation';
import { StoresSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { serialize } from 'object-to-formdata';
import { Suspense, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form } from '../../ui/form';

import { createStore } from '@/actions/store/create-store';
import { toast } from '@/components/ui/use-toast';
import { FormStepper } from './form-stepper';
import LocationAddressStep, { addressStepDefaultValues } from './store-address-step';
import { StoreDetailsStep, detailsStepDefaultValues } from './store-details-step';
import LocationMapStep, { mapStepDefaultValues } from './store-map-step';

export type StoresFormInputProps = z.infer<typeof StoresSchema>;

type StoresResponse = {
	store: any;
};

interface StoresFormProps {
	isEditing?: boolean;
	editingStore?: any | null;
	onComplete?: () => void;
}

export function StoresForm(props: StoresFormProps) {
	const { update } = useSession();

	const defaultStore = props.isEditing ? props.editingStore : null;

	const form = useForm<StoresFormInputProps>({
		resolver: zodResolver(StoresSchema),
		defaultValues: {
			...detailsStepDefaultValues,
			...addressStepDefaultValues,
			...mapStepDefaultValues,
		},
	});

	const { query: createLocationQuery, isLoading: isCreating } = useMutation<
		FormData,
		StoresResponse
	>({
		queryFn: async (values) => await createStore(values!),

		onCompleted: async (data) => {
			form.reset();
		},
	});

	const { query: updateLocationQuery, isLoading: isUpdating } = useMutation<
		FormData,
		StoresResponse
	>({
		// queryFn: async (values) => await editStore(values!),
		queryFn: async (values) => {},
		onCompleted: async (data) => {
			form.reset();
		},
	});

	const onSubmit: SubmitHandler<StoresFormInputProps> = async (body) => {
		// const formData = new FormData();

		const formattedOpeningTimes = body.openingTimes?.map((dayData) => {
			const time = dayData?.map((times) => {
				let hours = Number(times?.time?.split(':')?.[0]) ?? 0;
				let minutes = Number(times?.time?.split(':')?.[1]) ?? 0;

				//convert minutes to hour minutes
				const originalMinutes = minutes / 0.6 / 100;

				if (times.period === 'pm') {
					return Number(`${hours + 12 + originalMinutes}`);
				} else {
					return Number(`${hours + originalMinutes}`);
				}
			});
			return time;
		});

		const formData = serialize(
			{
				name: body.name,
				image: typeof body.image === 'string' ? undefined : body.image,
				geolocation: {
					boundingBox: body.boundingBox,
					zoom: body.zoom,
					longitude: body.longitude,
					latitude: body.latitude,
					address: body.address,
				},
			},
			{ indices: true, dotsForObjectNotation: true }
		);

		formattedOpeningTimes?.map((dayData, index) => {
			dayData?.map((timeData, timeIndex) => {
				formData.append(
					`details.openingTimes.${index}.0.${timeIndex}`,
					JSON.stringify(timeData)
				);
			});
			if (!dayData?.length) {
				formData.append(`details.openingTimes.${index}.0.0`, JSON.stringify(0));
				formData.append(`details.openingTimes.${index}.0.1 `, JSON.stringify(0));
			}
		});

		if (props.isEditing) {
			formData.append('locationId', props.editingStore?.id ?? '');

			toast({
				description: 'Editing store...',
				variant: 'default',
			});

			await updateLocationQuery(formData);
			setStep('details');
			props.onComplete?.();
		} else {
			toast({
				description: 'Creating store...',
				variant: 'default',
			});
			const newLocation = await createLocationQuery(formData);
			setStep('details');
			props.onComplete?.();
		}
	};

	const [step, setStep] = useState<'details' | 'map' | 'address'>('details');

	let descriptionText = '';

	if (step === 'details') {
		descriptionText = 'Add details about your store';
	} else if (step === 'map') {
		descriptionText = 'Search an address, and pin the position of your store.';
	} else if (step === 'address') {
		descriptionText = 'Verify address details';
	}
	return (
		<div className="h-full flex flex-col ">
			<Form {...form}>
				<form className="h-full flex flex-col ">
					<div className="my-4">
						<p className="font-medium text-xl">
							{props.isEditing ? 'Edit' : 'Create'} store
						</p>
						<p className="text-sm text-muted-foreground">{descriptionText}</p>
					</div>
					<FormStepper
						className="my-6"
						steps={['Details', 'Map', 'Address']}
						active={step}
					/>
					<div className="space-y-4 h-full">
						{step === 'details' ? (
							<StoreDetailsStep
								onSubmit={(values) => {
									form.setValue('name', values.name);
									form.setValue('image', values.image);
									form.setValue('openingTimes', values.openingTimes);

									setStep('map');
								}}
								isLoading={isCreating || isUpdating}
								isEditing={props.isEditing}
								editingStore={props.editingStore}
							/>
						) : null}

						{step === 'map' ? (
							<Suspense fallback={<p>Loading...</p>}>
								<LocationMapStep
									onBack={() => {
										setStep('details');
									}}
									onSubmit={(values) => {
										form.setValue('latitude', values.latitude);
										form.setValue('longitude', values.longitude);
										form.setValue('zoom', values.zoom);
										form.setValue('boundingBox', values.boundingBox);
										form.setValue('address', values.address);
										setStep('address');
									}}
									isLoading={isCreating || isUpdating}
									isEditing={props.isEditing}
									editingStore={props.editingStore ?? form.watch()}
								/>
							</Suspense>
						) : null}

						{step === 'address' ? (
							<LocationAddressStep
								onBack={() => {
									setStep('map');
								}}
								onSubmit={(values) => {
									form.setValue('address', {
										...form.getValues('address'),
										...values.address,
									});

									form.handleSubmit(onSubmit)();
								}}
								isLoading={isCreating || isUpdating}
								isEditing={props.isEditing}
								editingStore={props.editingStore ?? form.watch()}
							/>
						) : null}
					</div>
				</form>
			</Form>
		</div>
	);
}
