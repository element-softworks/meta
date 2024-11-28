import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldValues, Path, useFieldArray, useFormContext } from 'react-hook-form';
import { StoreResponse, getStores } from '@/actions/store/get-stores';
import { FormLabel, FormMessage } from '../ui/form';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../ui/command';
import { PoliciesFormInputProps } from '../policies/policies-form';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import Image from 'next/image';

type StoresInputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
};

export function StoresInput<T extends FieldValues>(props: StoresInputProps<T>) {
	const { watch, control } = useFormContext<PoliciesFormInputProps>();
	const [stores, setStores] = useState<StoreResponse['stores']>([]);
	const [value, setAutocompleteValue] = useState('');
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const {
		formState: { errors },
	} = useFormContext<PoliciesFormInputProps>();

	const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
		control,
		name: props.name as 'stores',
	});

	const error = errors[props.name as 'stores']?.message;

	useEffect(() => {
		(async () => {
			console.log('stores response data searching... 2');

			const storesResponse = (await getStores(20, 1, value ?? '', false)) as StoreResponse;

			console.log(storesResponse, 'stores response data');
			setStores(storesResponse?.stores);
		})();
	}, [value, autocompleteOpen]);

	const storesData = watch('stores');
	const filteredStores = stores?.filter((store) => {
		return !storesData?.some((storeData) => storeData.id === store?.store?.id);
	});

	return (
		<div className="relative">
			{!!autocompleteOpen && (
				<div
					className="w-full h-screen fixed top-0 left-0  z-50"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setAutocompleteOpen(false);
					}}
				></div>
			)}
			<FormLabel className={`flex gap-0.5 mb-2 ${!!error ? 'text-destructive' : ''}`}>
				Stores <p className="text-destructive">*</p>
			</FormLabel>
			<Command className={`bg-card h-fit ${!!error ? '' : 'mb-4'}`}>
				<CommandInput
					onClick={() => {
						setAutocompleteOpen((prev) => !prev);
					}}
					value={value}
					onValueChange={(search) => {
						setAutocompleteValue(search);
						setAutocompleteOpen(true);
					}}
					placeholder="Search stores..."
				/>
				<CommandList
					className={`z-[60] bg-card w-full ${
						autocompleteOpen ? 'block absolute top-16 left-0' : 'hidden'
					}`}
				>
					{autocompleteOpen ? (
						<>
							<CommandEmpty> No stores found.</CommandEmpty>
							<CommandGroup>
								{filteredStores?.map?.((store, index) => (
									<CommandItem
										className="cursor-pointer flex flex-col text-start items-start"
										key={index}
										onSelect={(currentValue) => {
											append({
												id: store?.store?.id,
												label: store?.store?.name,
											});

											setAutocompleteValue('');
											setAutocompleteOpen(false);
										}}
									>
										<div className="flex flex-row gap-2 items-center">
											{!!store?.store?.coverImageAsset ? (
												<Image
													className="rounded-md object-cover"
													alt={store?.store?.name}
													src={store?.store?.coverImageAsset}
													width={80}
													height={100}
												/>
											) : null}

											<div className="flex flex-col">
												<p>{store.store?.name}</p>
												<p className="text-muted-foreground text-xs line-clamp-2">
													{store?.store?.geolocation?.addressName}
												</p>
											</div>
										</div>
										<Separator />
									</CommandItem>
								))}
							</CommandGroup>
						</>
					) : null}
				</CommandList>
			</Command>
			<FormMessage className="mb-4 text-destructive">{error}</FormMessage>

			<div className="flex gap-2 flex-wrap ">
				{fields?.map?.((field, index) => {
					return (
						<Badge
							onClick={() => remove(index)}
							variant="outline"
							className="text-nowrap group/badge cursor-pointer hover:bg-destructive/10"
							key={index}
						>
							{field.label}{' '}
							<X
								className="border ml-2 bg-border cursor-pointer group-hover/badge:bg-destructive/20 transition-all group-hover/badge:border-destructive/10 -mr-1 rounded-lg"
								size={18}
							/>
						</Badge>
					);
				})}
			</div>
		</div>
	);
}
