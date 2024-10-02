'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useParam } from '@/hooks/use-param';
import { useState } from 'react';
import { DateRangePicker } from './date-range-picker';
import { addDays, format, subYears } from 'date-fns';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';
import { custom } from 'zod';

interface DateSelectorPicker {
	id?: string;
	searchParams: any;
	className?: string;
	longRanges?: boolean;
	default?: 'week' | 'month' | 'year' | '3 months' | '6 months' | 'today';
}

export function DateSelectorPicker(props: DateSelectorPicker) {
	const dateTypeQuery = props.searchParams?.[`${!!props.id ? `${props.id}-` : ''}dateType`];

	const { mutateParams } = useParam();
	const [selectedValue, setSelectedValue] = useState<string>(
		!!dateTypeQuery?.length ? dateTypeQuery : !!props.default?.length ? props.default : 'week'
	);
	const [selectOpen, setSelectOpen] = useState<boolean>(false);
	const [customPickerOpen, setCustomPickerOpen] = useState<boolean>(false);

	const startDateQuery = props.searchParams?.[`${!!props.id ? `${props.id}-` : ''}startDate`];
	const endDateQuery = props.searchParams?.[`${!!props.id ? `${props.id}-` : ''}endDate`];

	const formattedStartDate = !!startDateQuery
		? format(new Date(startDateQuery), 'LLL dd, y')
		: undefined;
	const formattedEndDate = !!endDateQuery
		? format(new Date(endDateQuery), 'LLL dd, y')
		: undefined;

	const customText =
		!!startDateQuery && !!endDateQuery && dateTypeQuery === 'custom'
			? `${formattedStartDate} - ${formattedEndDate}`
			: 'Custom';

	const handleOnValueChange = (val: string) => {
		setSelectedValue(val);

		let startDate;
		let endDate: Date = new Date(); // Default to the current date and time for the endDate

		switch (val) {
			case 'today':
				startDate = startOfDay(new Date());
				endDate = endOfDay(new Date());
				break;

			case 'week':
				startDate = addDays(new Date(), -6); // Start date is 1 week ago
				endDate = new Date(); // End date is now
				break;

			case 'month':
				startDate = subMonths(new Date(), 1); // Start date is 1 month ago
				endDate = new Date(); // End date is now
				break;

			case '3 months':
				startDate = subMonths(new Date(), 3); // Start date is 3 months ago
				endDate = new Date(); // End date is now
				break;

			case '6 months':
				startDate = subMonths(new Date(), 6); // Start date is 6 months ago
				endDate = new Date(); // End date is now
				break;

			case 'year':
				startDate = subMonths(new Date(), 12); // Start date is 1 year ago
				endDate = new Date(); // End date is now
				break;

			default:
				// Optional: Handle invalid or unrecognized input
				console.error('Invalid time range:', val);
				startDate = new Date(); // Set a default start date if needed
				endDate = new Date(); // Set a default end date if needed
				break;
		}

		console.log(val, 'value cheee');
		if (val === 'custom') {
			if (customPickerOpen) {
				setCustomPickerOpen(false);
			} else {
				setCustomPickerOpen(true);
			}
		} else {
			setSelectOpen(false);
			mutateParams({
				[`${!!props.id ? `${props.id}-` : ''}startDate`]:
					startDate?.toISOString() ?? new Date(Date.now()).toISOString(),
				[`${!!props.id ? `${props.id}-` : ''}endDate`]:
					endDate?.toISOString() ?? new Date(Date.now()).toISOString(),
				[`${!!props.id ? `${props.id}-` : ''}dateType`]: val,
			});
		}
	};

	return (
		<>
			<Dialog
				open={customPickerOpen}
				onOpenChange={(state) => {
					setCustomPickerOpen(state);
				}}
			>
				<DialogContent className="w-fit max-w-[90%] overflow-scroll">
					<DialogHeader>
						<DialogTitle>Custom date picker</DialogTitle>
						<DialogDescription>
							Select a custom date range to view analytics
						</DialogDescription>
					</DialogHeader>

					<DateRangePicker
						onDateChange={() => setSelectOpen(false)}
						embedded
						searchParams={props.searchParams}
						id={props.id}
					/>
				</DialogContent>
			</Dialog>
			<Select
				onOpenChange={(state) => {
					// if (selectedValue === 'custom' && ) return;
					setSelectOpen(state);
				}}
				open={selectOpen}
				value={selectedValue}
				onValueChange={handleOnValueChange}
			>
				<SelectTrigger
					onClick={() => setSelectOpen((prev) => !prev)}
					className="w-[180px] !mt-0"
				>
					<SelectValue placeholder="Select a date range" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="today">Today</SelectItem>
						<SelectItem value="week">Last week</SelectItem>
						<SelectItem value="month">Last month</SelectItem>

						{props.longRanges && (
							<>
								<SelectItem value="3 months">Last 3 months</SelectItem>
								<SelectItem value="6 months">Last 6 months</SelectItem>
								<SelectItem value="year">Last year</SelectItem>
							</>
						)}
						<SelectItem onClick={() => setCustomPickerOpen(true)} value="custom">
							{customText}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
}
