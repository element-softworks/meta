'use client';
import { CalendarIcon, User } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Dropzone, { Accept } from 'react-dropzone';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { FormLabel } from '../ui/form';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import timezones from '@/lib/timezones.json';
import { DateSelectInput } from './date-select-input';

interface CertificateDropzoneInputProps {
	name: string;
	multiple?: boolean;
	accept?: Accept | undefined;
	defaultFiles?: string[];
	isLoading?: boolean;
	label?: string;
	placeholder?: string;
	icon?: React.ReactNode;
}

export function CertificateDropzoneInput(props: CertificateDropzoneInputProps) {
	const { multiple = false } = props;
	const { control, formState, watch, setValue } = useFormContext();

	// const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
	// 	control,
	// 	name: props.name,
	// });

	const { fields, append, remove } = useFieldArray({ control, name: props.name });

	const error = formState.errors[props.name];

	useEffect(() => {
		if (props.defaultFiles) {
			props.defaultFiles.forEach((file) => append({ file }));
		}
	}, []);

	return (
		<>
			<Controller
				name={props.name}
				control={control}
				render={({ field: { onChange } }) => (
					<div className="">
						{props.label ? (
							<FormLabel
								className={`text-sm font-normal ${
									!!error ? 'text-destructive' : ''
								}`}
							>
								{props.label}
							</FormLabel>
						) : null}

						<Dropzone
							multiple={multiple}
							onDrop={(acceptedFiles) => {
								const newFiles = acceptedFiles.map((file) => ({ file }));
								append([...fields, ...newFiles]);
							}}
							accept={
								props.accept ?? {
									'image/webp': [],
									'image/png': [],
									'image/jpeg': [],
									'image/jpg': [],
									'image/gif': [],
								}
							}
						>
							{({ getRootProps, getInputProps, acceptedFiles }) => {
								return (
									<>
										<section className="mt-1">
											<div
												{...getRootProps()}
												className={`group border flex-col gap-2 bg-background h-40 border-input rounded-2xl flex items-center justify-center transition cursor-pointer ${
													!!error
														? 'border-destructive'
														: 'hover:border-primary hover:bg-background/80'
												}`}
											>
												<input
													{...getInputProps({
														onChange: (e) => {
															onChange(acceptedFiles);
														},
													})}
												/>

												<div className="bg-card w-[40px] h-[40px] flex justify-center items-center rounded-full">
													{!!props.icon ? (
														props.icon
													) : (
														<User className="text-muted-foreground" />
													)}
												</div>
												<p
													className={`text-center text-sm font-sans font-light max-w-[34ch] px-2 ${
														!!error
															? 'text-destructive'
															: `text-muted-foreground group-hover:text-primary`
													} transition`}
												>
													{!!error
														? (error as any)?.[props.name]?.message ??
														  error?.message
														: props?.placeholder ??
														  'Drag and drop some files here, or click to select files'}
												</p>
											</div>
										</section>
										<div
											className={`flex gap-2 flex-wrap ${
												!!((fields?.length ?? 0) > 0) ? 'mt-4' : ''
											}`}
										>
											{fields.map((item: any, index) => (
												<div
													key={item.id}
													className="border rounded-lg p-4 w-full"
												>
													<p className="font-medium font-display">
														{typeof item.file === 'string'
															? item.file
															: item?.file?.name || 'Uploaded file'}
													</p>
													<div className="flex flex-col gap-4 mt-6">
														<DateSelectInput
															isLoading={false}
															name={`${props.name}.${index}.certifiedDate`}
															label="Certified date"
														/>
														<FormInput
															name={`${props.name}.${index}.certificateName`}
															label="Certificate name"
															render={({ field }) => (
																<Select
																	value={field.value}
																	onValueChange={field.onChange}
																>
																	<SelectTrigger>
																		<SelectValue placeholder="Select a certificate" />
																	</SelectTrigger>
																	<SelectContent>
																		{timezones.map(
																			(timezone, i) => (
																				<SelectItem
																					key={i}
																					value={
																						timezone.zone
																					}
																				>
																					{timezone.zone}{' '}
																					{timezone.gmt}
																				</SelectItem>
																			)
																		)}
																	</SelectContent>
																</Select>
															)}
														/>
														<FormInput
															name={`${props.name}.${index}.institution`}
															label="Institution"
															render={({ field }) => (
																<Select
																	value={field.value}
																	onValueChange={field.onChange}
																>
																	<SelectTrigger>
																		<SelectValue placeholder="Select an institution" />
																	</SelectTrigger>
																	<SelectContent>
																		{timezones.map(
																			(timezone, i) => (
																				<SelectItem
																					key={i}
																					value={
																						timezone.zone
																					}
																				>
																					{timezone.zone}{' '}
																					{timezone.gmt}
																				</SelectItem>
																			)
																		)}
																	</SelectContent>
																</Select>
															)}
														/>
														<Button
															className="w-fit mt-4"
															variant="destructive"
															onClick={() => remove(index)}
														>
															Remove certificate
														</Button>
													</div>
												</div>
											))}
										</div>
									</>
								);
							}}
						</Dropzone>
					</div>
				)}
			/>
		</>
	);
}
