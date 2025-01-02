import { useState } from 'react';
import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';
import countries from '@/countries.json';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../ui/command';
import { FormLabel, FormMessage } from '../ui/form';
type CountrySelectProps<T extends FieldValues> = {
	name: Path<T>;
};
const CountrySelect = <T extends FieldValues>(props: CountrySelectProps<T>) => {
	// const [selectedCountry, setSelectedCountry] = useState(props.value);

	const {
		field,
		fieldState: { error },
		formState: { errors },
	} = useController<T, Path<T>>({
		name: props.name,
	});

	const { getValues } = useFormContext();

	const selectedCountry = countries.find(
		(country) =>
			country.code?.toLowerCase() === field?.value?.toLowerCase() ||
			country.name?.toLowerCase() === field?.value?.toLowerCase()
	);

	console.log(field.value, 'selectedCountry');

	const [value, setAutocompleteValue] = useState(selectedCountry?.name);

	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

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
				Country <p className="text-destructive">*</p>
			</FormLabel>
			<Command className={`bg-card h-fit ${!!error ? '' : 'mb-4'}`}>
				<CommandInput
					onClick={() => {
						setAutocompleteOpen((prev) => !prev);
					}}
					defaultValue={selectedCountry?.name}
					value={value ?? selectedCountry?.name}
					onValueChange={(search) => {
						setAutocompleteValue(search);
						setAutocompleteOpen(true);
					}}
					placeholder="Search a country..."
				/>
				<CommandList
					className={`z-[60] bg-card w-full ${
						autocompleteOpen ? 'block absolute top-16 left-0' : 'hidden'
					}`}
				>
					{' '}
					{autocompleteOpen ? (
						<>
							<CommandEmpty> No counties found.</CommandEmpty>
							<CommandGroup>
								{countries?.map?.((country, index) => (
									<CommandItem
										key={index}
										onSelect={(currentValue) => {
											setAutocompleteValue(currentValue);

											const selectedCountry = countries.find(
												(country) =>
													country.name?.toLowerCase() ===
													currentValue.toLowerCase()
											);

											field.onChange(selectedCountry?.code);
											setAutocompleteOpen(false);
										}}
									>
										<div className="flex items-center" {...props}>
											<img
												loading="lazy"
												width="20"
												srcSet={`https://flagcdn.com/w40/${country?.code?.toLowerCase()}.png 2x`}
												src={`https://flagcdn.com/w20/${country?.code?.toLowerCase()}.png`}
												alt={`${country?.name} country flag`}
											/>
											<p>{country?.name}</p>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</>
					) : null}
				</CommandList>
			</Command>
			<FormMessage className="mb-4 text-destructive">{error?.message}</FormMessage>
		</div>
	);
};

export default CountrySelect;
