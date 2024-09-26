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
import { addDays, format } from 'date-fns';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns';

interface DateSelectorPicker {
	id?: string;
	searchParams: any;
	className?: string;
}

export function DateSelectorPicker(props: DateSelectorPicker) {
	const dateTypeQuery = props.searchParams?.[`${!!props.id ? `${props.id}-` : ''}dateType`];

	const { mutateParams } = useParam();
	const [selectedValue, setSelectedValue] = useState<string>(
		!!dateTypeQuery?.length ? dateTypeQuery : 'week'
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
					if (selectedValue === 'custom') return;
					setSelectOpen(state);
				}}
				open={selectOpen}
				value={selectedValue}
				onValueChange={(val) => {
					setSelectedValue(val);

					let startDate;
					let endDate: Date = new Date(); // Default to the current date and time for the endDate

					if (val === '24 hours') {
						startDate = new Date(Date.now());
						endDate = new Date(Date.now());
					} else if (val === 'week') {
						// Start 7 days ago and end now
						startDate = addDays(new Date(), -6); // Start date is 1 week ago
						endDate = new Date(); // End date is now
					} else if (val === 'month') {
						// Start 1 month ago and end now
						startDate = subMonths(new Date(), 1); // Start date is 1 month ago
						endDate = new Date(); // End date is now
					}

					if (val === 'custom') {
						setCustomPickerOpen(true);
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
				}}
			>
				<SelectTrigger
					onClick={() => setSelectOpen((prev) => !prev)}
					className="w-[180px] !mt-0"
				>
					<SelectValue placeholder="Select a date range" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="24 hours">Last 24 hours</SelectItem>
						<SelectItem value="week">Last week</SelectItem>
						<SelectItem value="month">Last month</SelectItem>
						<SelectItem onClick={() => setCustomPickerOpen(true)} value="custom">
							{customText}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
}
