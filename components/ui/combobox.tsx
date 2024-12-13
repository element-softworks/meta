'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useRouter } from 'next/navigation';

interface ComboboxProps {
	items: { label: string; value: string }[];
	onSelect?: (value: string) => void;
	label?: string;
	defaultValue?: string;
	useParams?: boolean;
	id?: string;
}

export function Combobox(props: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(props.defaultValue);
	const router = useRouter();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value
						? props.items.find((item) => item.value === value)?.label
						: props?.label
						? `Select ${props.label}`
						: 'Select framework...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder={props.label ? `Search ${props.label}` : `Search framework...`}
					/>
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{props.items?.map?.((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										props.onSelect?.(currentValue);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === item.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
