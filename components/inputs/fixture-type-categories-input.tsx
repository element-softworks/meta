import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FieldValues, Path, useController, useFieldArray, useFormContext } from 'react-hook-form';
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
import { FixtureTypeFormInputProps } from '../fixture-types/form/fixture-type-form';
import { FixtureTypeCategory } from '@/db/drizzle/schema/fixtureTypeCategory';
import {
	FixtureTypeCategoriesResponse,
	getFixtureTypeCategories,
} from '@/actions/fixture-type-categories/get-fixture-type-categories';

type FixtureTypeCategoriesInputProps<T extends FieldValues> = {
	name: Path<T>;
	label?: string;
	placeholder?: string;
	onChange?: (value: string) => void;
	defaultValue?: string;
};

export function FixtureTypeCategoriesInput<T extends FieldValues>(
	props: FixtureTypeCategoriesInputProps<T>
) {
	const { watch, control, setValue } = useFormContext<PoliciesFormInputProps>();
	const [categories, setCategories] = useState<FixtureTypeCategory[]>([]);
	const [autocompleteOpen, setAutocompleteOpen] = useState(false);

	const {
		field,
		fieldState: { error },
		formState: { errors },
	} = useController<T, Path<T>>({
		name: props.name,
	});

	const [value, setAutocompleteValue] = useState(field?.value?.label ?? '');

	useEffect(() => {
		(async () => {
			const categoryResponse = (await getFixtureTypeCategories(
				20,
				1,
				value ?? '',
				false
			)) as FixtureTypeCategoriesResponse;

			setCategories(categoryResponse?.fixtureTypeCategories);
		})();
	}, [value, autocompleteOpen]);

	const fixtureTypeCategoryData = watch('stores');
	const filteredCategories = categories?.filter((store) => {
		return !fixtureTypeCategoryData?.some((storeData) => storeData.id === store?.id);
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
				Category <p className="text-destructive">*</p>
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
					placeholder="Search categories..."
				/>
				<CommandList
					className={`z-[60] bg-card w-full ${
						autocompleteOpen ? 'block absolute top-16 left-0' : 'hidden'
					}`}
				>
					{autocompleteOpen ? (
						<>
							<CommandEmpty> No categories found.</CommandEmpty>
							<CommandGroup>
								{filteredCategories?.map?.((category, index) => (
									<CommandItem
										className="cursor-pointer flex flex-col text-start items-start"
										key={index}
										onSelect={(currentValue) => {
											field.onChange({
												label: category?.name,
												id: category?.id,
											});
											setAutocompleteValue(category?.name);

											setAutocompleteOpen(false);
										}}
									>
										<div className="flex flex-row gap-2 items-center">
											<p>{category?.name}</p>
										</div>
										<Separator />
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
}
