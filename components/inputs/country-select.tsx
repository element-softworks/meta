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
import { FormLabel } from '../ui/form';
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

	const [value, setAutocompleteValue] = useState(getValues('address.country') ?? '');

	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	return (
		<div>
			<FormLabel className="flex gap-0.5 mb-2">
				Country <p className="text-destructive">*</p>
			</FormLabel>
			<Command className="mb-4 bg-card h-fit">
				<CommandInput
					value={value}
					onValueChange={(search) => {
						setAutocompleteValue(search);
						setAutocompleteOpen(true);
					}}
					placeholder="Search a country..."
				/>
				<CommandList className={`${autocompleteOpen ? 'block' : 'hidden'}`}>
					{autocompleteOpen ? (
						<>
							<CommandEmpty> No counties found.</CommandEmpty>
							<CommandGroup>
								{countries?.map?.((country, index) => (
									<CommandItem
										key={index}
										value={country?.name}
										onSelect={(currentValue) => {
											setAutocompleteValue(currentValue);
											field.onChange(currentValue);
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
											<p>
												{country?.name} ({country?.code})
											</p>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</>
					) : null}
				</CommandList>
			</Command>
		</div>
	);
};

export default CountrySelect;
