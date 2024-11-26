'use client';

import { useMutation } from '@/hooks/use-mutation';
import { StoresSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form } from '../../ui/form';

import { toast } from '@/components/ui/use-toast';
import { FormStepper } from './form-stepper';
import LocationAddressStep, { addressStepDefaultValues } from './store-address-step';
import { StoreDetailsStep, detailsStepDefaultValues } from './store-details-step';
import LocationMapStep, { mapStepDefaultValues } from './store-map-step';
import { createStore } from '@/actions/store/create-store';
import { serialize } from 'object-to-formdata';

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

	const { query: createStoreQuery, isLoading: isCreating } = useMutation<
		FormData,
		StoresResponse
	>({
		queryFn: async (values) => {
			return await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/store`, {
				method: 'POST',
				body: values,
			}).then((res) => res.json());
		},

		onCompleted: async (data) => {
			console.log(data, 'response data');
			form.reset();
		},
	});

	const { query: updateStoreQuery, isLoading: isUpdating } = useMutation<
		z.infer<typeof StoresSchema>,
		StoresResponse
	>({
		// queryFn: async (values) => await editStore(values!),
		queryFn: async (values) => {},
		onCompleted: async (data) => {
			form.reset();
		},
	});

	const onSubmit: SubmitHandler<StoresFormInputProps> = async (body) => {
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
				contactEmail: body.contactEmail,
				contactPhone: body.contactPhone,
				maxCapacity: body.maxCapacity,
				zoom: body.zoom,
				longitude: body.longitude,
				latitude: body.latitude,
				address: body.address,
			},
			{ indices: true, dotsForObjectNotation: true }
		);

		formData.append('image', body.image?.[0]);

		body.boundingBox?.map((item, index) => {
			item?.map((i, iIndex) => {
				formData.append(`boundingBox.${index}.${iIndex}`, JSON.stringify(i));
			});
		});

		formattedOpeningTimes?.map((dayData, index) => {
			dayData?.map((timeData, timeIndex) => {
				formData.append(`openingTimes.${index}.0.${timeIndex}`, JSON.stringify(timeData));
			});
			if (!dayData?.length) {
				formData.append(`openingTimes.${index}.0.0`, JSON.stringify(0));
				formData.append(`openingTimes.${index}.0.1 `, JSON.stringify(0));
			}
		});

		if (props.isEditing) {
			toast({
				description: 'Editing store...',
				variant: 'default',
			});

			await updateStoreQuery({
				address: body.address,
				contactEmail: body.contactEmail,
				contactPhone: body.contactPhone,
				image: body.image,
				maxCapacity: body.maxCapacity,
				name: body.name,
				openingTimes: body.openingTimes,
				latitude: body.latitude,
				longitude: body.longitude,
				zoom: body.zoom,
				boundingBox: body.boundingBox,
			});
			setStep('details');
			props.onComplete?.();
		} else {
			toast({
				description: 'Creating store...',
				variant: 'default',
			});

			console.log(body, 'body data');
			const newLocation = await createStoreQuery(formData);
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

	console.log(form.watch(), 'form data');

	console.log(form.formState.errors, 'errors data');
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
									form.setValue('contactEmail', values.contactEmail);
									form.setValue('contactPhone', values.contactPhone);
									form.setValue('maxCapacity', values.maxCapacity);

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
