import { FormInput } from '@/components/auth/form-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import * as z from 'zod';

import { FormProvider, SubmitHandler, useForm, useFormContext } from 'react-hook-form';
import CountrySelect from '@/components/inputs/country-select';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { StoreAddressValidationSchema } from '@/schemas';

export type StoreAddressInputProps = z.infer<typeof StoreAddressValidationSchema>;

type StoreAddressStepProps = {
	isEditing?: boolean;
	editingStore?: any | null;
	onSubmit: (values: StoreAddressInputProps) => void;
	onBack: () => void;
	isLoading: boolean;
};

const StoreAddressStep: React.FC<StoreAddressStepProps> = (props) => {
	const form = useForm({
		defaultValues: addressStepDefaultValues(props.editingStore),
		resolver: zodResolver(StoreAddressValidationSchema),
	});

	const { handleSubmit, watch } = form;
	const country = watch('address.country');
	const geolocationCountry = props.editingStore?.address?.country;

	async function onSubmit(values: StoreAddressInputProps) {
		props.onSubmit(values);
	}

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 h-full">
				{!!geolocationCountry && geolocationCountry !== country ? (
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<p>Address country changed</p>
							<p>
								Your address country must match your map position, please change
								your address in the previous step to be within {country}.
							</p>
						</div>
						<Button variant="outline" onClick={() => props.onBack()}>
							Search address
						</Button>
					</div>
				) : (
					<>
						<FormInput
							required
							name="address.lineOne"
							label="Line one"
							render={({ field }) => <Input {...field} />}
						/>

						<FormInput
							name="address.lineTwo"
							label="Line two"
							render={({ field }) => <Input {...field} />}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormInput
								required
								name="address.county"
								label="County"
								render={({ field }) => <Input {...field} />}
							/>
							<FormInput
								required
								name="address.city"
								label="City"
								render={({ field }) => <Input {...field} />}
							/>
						</div>

						<FormInput
							required
							name="address.postCode"
							label="Postal code"
							render={({ field }) => <Input {...field} />}
						/>

						<CountrySelect name="address.country" />
					</>
				)}

				<div className="!mt-auto">
					<div className="flex gap-4 md:gap-20 !mt-4">
						<Button
							variant="outline"
							onClick={props.onBack}
							className="w-fit mt-auto z-40 relative"
							isLoading={props.isLoading}
						>
							<ArrowLeft size={20} className="mr-2" />
							back
						</Button>
						<Button
							variant={props.isEditing ? 'default' : 'successful'}
							onClick={form.handleSubmit(onSubmit)}
							className="w-full mt-auto z-40 relative"
							isLoading={props.isLoading}
						>
							Submit
							<ArrowRight size={20} className="ml-2" />
						</Button>
					</div>
				</div>
			</form>
		</FormProvider>
	);
};

export const addressStepDefaultValues = (store?: any) => {
	const methods = useFormContext<StoreAddressInputProps>();
	const { getValues } = methods || {};

	return {
		address: {
			name: getValues?.('address.name') ?? store?.geolocation?.address?.name ?? '',
			lineOne: getValues?.('address.lineOne') ?? store?.geolocation?.address?.lineOne ?? '',
			lineTwo: getValues?.('address.lineTwo') ?? store?.geolocation?.address?.lineTwo ?? '',
			city: getValues?.('address.city') ?? store?.geolocation?.address?.city ?? '',
			county: getValues?.('address.county') ?? store?.geolocation?.address?.county ?? '',
			country: getValues?.('address.country') ?? store?.geolocation?.address?.country ?? '',
			postCode:
				getValues?.('address.postCode') ?? store?.geolocation?.address?.postCode ?? '',
		},
	};
};

export default StoreAddressStep;
