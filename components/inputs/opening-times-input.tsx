'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import TimeInput from './time-input';
import { FormLabel } from '../ui/form';
import { StoreDetailsInputProps } from '../store/form/store-details-step';

export interface OpeningTimesInputProps {
	label: React.ReactNode;
	helperText?: React.ReactNode;
	errorText?: string;
}

const days = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

export function OpeningTimesInput(props: OpeningTimesInputProps) {
	const methods = useFormContext<StoreDetailsInputProps>();
	const {
		watch,
		getValues,
		setValue,
		control,
		formState: { errors },
	} = methods || {};

	const hasError = errors?.openingTimes;

	return (
		<div className="flex flex-col gap-2">
			<FormLabel className="flex gap-1">
				{props.label} <p className="text-destructive">*</p>
			</FormLabel>
			<div className="flex flex-col gap-4">
				{days.map((day, index) => {
					const error = errors?.openingTimes?.[index]?.root?.message;
					const isChecked = !!watch(`openingTimes.${index}`)?.length;

					return (
						<div
							key={index}
							className="grid grid-cols-12 gap-4 items-center flex-wrap w-full min-h-10"
						>
							<Controller
								name="openingTimes"
								control={control}
								render={({ field }) => {
									const currentField = field?.value?.[index];

									const isClosed = !currentField?.length;

									return (
										<div className="col-span-12 sm:col-span-2 flex flex-row items-center gap-2">
											<Checkbox
												checked={!isClosed}
												onCheckedChange={(checked) => {
													setValue(
														`openingTimes.${index}`,
														checked
															? [
																	{ time: '09:00', period: 'am' },
																	{ time: '05:00', period: 'pm' },
															  ]
															: []
													);
												}}
											/>
											<p className="text-sm">{day}</p>
										</div>
									);
								}}
							/>
							{isChecked && (
								<div className="col-span-12 sm:col-span-10 flex  flex-row gap-2 items-center">
									<TimeInput
										error={!!error?.length}
										defaultZone={
											getValues(`openingTimes.${index}`)?.[0]?.period as
												| 'am'
												| 'pm'
										}
										name={`openingTimes.${index}`}
										index={0}
									/>
									<p>to</p>
									<TimeInput
										error={!!error?.length}
										defaultZone={
											getValues(`openingTimes.${index}`)?.[1]?.period as
												| 'am'
												| 'pm'
										}
										name={`openingTimes.${index}`}
										index={1}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
