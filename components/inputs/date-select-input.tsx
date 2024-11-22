import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormInput } from '../auth/form-input';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useFormContext } from 'react-hook-form';

interface DateSelectInputProps {
	showYears?: boolean;
	isLoading: boolean;
	name: string;
	label?: string;
	disabled?: boolean;
	placeholder?: string;
	onChange?: (value: string) => void;
}
export function DateSelectInput(props: DateSelectInputProps) {
	const { watch } = useFormContext();
	const [date, setDate] = useState<Date>(watch(props.name));

	useEffect(() => {
		setDate(watch(props.name));
	}, [watch(props.name)]);

	return (
		<FormInput
			name={props.name}
			label={props.label}
			render={({ field }) => (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={'outline'}
							className={cn(
								'flex justify-start w-full rounded-xl px-3 !mt-1 text-left font-normal',
								!date && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className="mr-1" size={20} />
							{date ? format(date, 'PPP') : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							fromYear={1960}
							toYear={2030}
							captionLayout="dropdown-buttons"
							mode="single"
							selected={date}
							onSelect={(date) => {
								setDate(date!);
								!!props.onChange
									? props.onChange?.(date?.toISOString()!)
									: field.onChange(date?.toISOString());
							}}
							initialFocus
						/>
					</PopoverContent>
				</Popover>

				// <Input {...field} />
			)}
		/>
	);
}
