import { add, format, startOfDay } from 'date-fns';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

interface TimeInputProps {
	helperText?: React.ReactNode;
	errorText?: string;
	error?: boolean;
	name: string;
	index: number;
	defaultZone: 'am' | 'pm';
}

const TimeInput = (props: TimeInputProps) => {
	const methods = useFormContext();
	const {
		watch,
		getValues,
		setValue,
		trigger,
		control,
		formState: { errors },
	} = methods || {};

	return (
		<div className="flex flex-row items-center relative">
			<Controller
				name={`${props.name}.${props.index}`}
				control={control}
				render={({ field }) => {
					return (
						<Input
							defaultValue={field.value.time}
							value={field.value.time}
							onChange={(e) => {
								if (!e.target.value) return;

								const formattedTime = e.target.value.split(':')?.map((num) => +num);
								const hours = formattedTime?.[0];

								if (hours > 12)
									return setValue(`${props.name}.${props.index}.time`, '12:00');
								const minutes = formattedTime?.[1];

								if (hours === 12 && minutes > 0) {
									const formattedFieldValue = format(
										new Date(
											add(startOfDay(Date.now()), {
												hours: hours,
												minutes: 0,
											})
										),
										'hh:mm'
									);
									return setValue(
										`${props.name}.${props.index}.time`,
										formattedFieldValue
									);
								}

								setValue(`${props.name}.${props.index}.time`, e.target.value);
							}}
							className={`px-1 !rounded-tr-none !rounded-br-none border-r-0 ${!props.error ? 'border-input' : '!ring-destructive !border-destructive'}`}
							type="time"
						/>
					);
				}}
			/>

			<Controller
				name={props.name}
				control={control}
				render={({ field }) => {
					return (
						<select
							className={`rounded-tl-none rounded-bl-none flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${!props.error ? '' : '!ring-destructive !border-destructive bg-danger'}`}
							onChange={(e) => {
								return setValue(
									`${props.name}.${props.index}.period`,
									e.target.value
								);
							}}
							defaultValue={props?.defaultZone}
						>
							<option value="am">am</option>
							<option value="pm">pm</option>
						</select>
					);
				}}
			/>
		</div>
	);
};

export default TimeInput;
