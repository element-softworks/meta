'use client';

import { addDays, endOfDay, format, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { useParam } from '@/hooks/use-param';

interface DateRangePickerProps {
	id?: string;
	searchParams: { startDate: string; endDate: string };
	className?: string;
	embedded?: boolean;
	onDateChange?: () => void;
}

export function DateRangePicker(props: DateRangePickerProps) {
	const [date, setDate] = useState<DateRange | undefined>({
		from: props?.searchParams?.startDate
			? startOfDay(new Date(props.searchParams?.startDate))
			: startOfDay(addDays(new Date(Date.now()), -7)),
		to: props?.searchParams?.endDate
			? endOfDay(new Date(props.searchParams?.endDate))
			: endOfDay(new Date(Date.now())),
	});

	const { mutateParams } = useParam();

	useEffect(() => {
		props?.onDateChange?.();

		mutateParams({
			[`${!!props.id ? `${props.id}-` : ''}startDate`]:
				date?.from?.toISOString() ?? new Date(Date.now()).toISOString(),
			[`${!!props.id ? `${props.id}-` : ''}endDate`]:
				date?.to?.toISOString() ?? new Date(Date.now()).toISOString(),
			[`${!!props.id ? `${props.id}-` : ''}dateType`]: 'custom',
		});
	}, [date]);

	if (props.embedded) {
		return (
			<Calendar
				initialFocus
				mode="range"
				defaultMonth={date?.from}
				selected={date}
				onSelect={setDate}
				numberOfMonths={2}
				toDate={new Date(Date.now())}
			/>
		);
	}

	return (
		<div className={cn('grid gap-2', props.className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={'outline'}
						className={cn(
							'w-[300px] justify-start text-left font-normal',
							!date && 'text-muted-foreground'
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, 'LLL dd, y')} -{' '}
									{format(date.to, 'LLL dd, y')}
								</>
							) : (
								format(date.from, 'LLL dd, y')
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
						toDate={new Date(Date.now())}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
