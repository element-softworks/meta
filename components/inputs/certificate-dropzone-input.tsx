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
	const { control, formState, watch } = useFormContext();

	// const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
	// 	control,
	// 	name: props.name,
	// });

	const [files, setFiles] = React.useState<File[] | null | string[]>(props.defaultFiles ?? null);

	const error = formState.errors[props.name];

	useEffect(() => {
		if (!watch(props.name)) {
			setFiles(null);
		}

		if (props.defaultFiles && !watch(props.name)) {
			setFiles(props.defaultFiles);
		}
	}, [watch(props.name), props.defaultFiles, props.name, watch]);

	return (
		<>
			<Controller
				name={props.name}
				control={control}
				render={({ field: { onChange } }) => (
					<div className="">
						{props.label ? (
							<FormLabel
								className={`text-sm font-normal ${!!error ? 'text-destructive' : ''}`}
							>
								{props.label}
							</FormLabel>
						) : null}

						<Dropzone
							multiple={multiple}
							onDrop={(acceptedFiles) => {
								const wrappedFiles = acceptedFiles.map((file) => ({
									file,
								}));

								setFiles((prevFiles: any) => {
									// Merge previous files and new files wrapped in `.file`
									const mergedFiles = multiple
										? [...(prevFiles || []), ...wrappedFiles]
										: wrappedFiles;

									return mergedFiles;
								});

								onChange(
									multiple ? [...(files || []), ...wrappedFiles] : wrappedFiles
								);
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
												{!props.multiple && (files?.length ?? 0) === 1 ? (
													files?.map?.((file, index) => {
														const objectUrl =
															typeof file === 'string'
																? file
																: URL.createObjectURL(file);
														return (
															<Image
																className="w-[40px] h-[40px] object-cover rounded-full"
																key={index}
																src={objectUrl}
																alt="Dropzone image"
																width={75}
																height={75}
															/>
														);
													})
												) : (
													<div className="bg-card w-[40px] h-[40px] flex justify-center items-center rounded-full">
														{!!props.icon ? (
															props.icon
														) : (
															<User className="text-muted-foreground" />
														)}
													</div>
												)}
												<p
													className={`text-center text-sm font-sans font-light max-w-[34ch] px-2 ${
														!!error
															? 'text-destructive'
															: `text-muted-foreground group-hover:text-primary`
													} transition`}
												>
													{!!error
														? ((error as any)?.[props.name]?.message ??
															error?.message)
														: (props?.placeholder ??
															'Drag and drop some files here, or click to select files')}
												</p>
											</div>
										</section>
										<div
											className={`flex gap-2 flex-wrap ${!!((files?.length ?? 0) > 0) ? 'mt-4' : ''}`}
										>
											{props.multiple && (files?.length ?? 0) > 0
												? files?.map?.((file, index) => {
														return (
															<div
																className="border rounded-lg p-4 w-full"
																key={index}
															>
																<p className="font-medium font-display">
																	{typeof file !== 'string'
																		? (file as any)?.file?.name
																		: file}
																</p>

																<div className="flex flex-col gap-4 mt-6">
																	<DateSelectInput
																		isLoading={false}
																		name={`certificates.${index}.certifiedDate`}
																		label="Certified date"
																	/>

																	<FormInput
																		name={`certificates.${index}.certificateName`}
																		label="Certificate name"
																		render={({ field }) => (
																			<Select
																				value={field.value}
																				onValueChange={(
																					value
																				) => {
																					if (!value)
																						return;
																					field.onChange(
																						value
																					);
																				}}
																			>
																				<SelectTrigger>
																					<SelectValue placeholder="Select a certificate" />
																				</SelectTrigger>
																				<SelectContent>
																					{timezones?.map?.(
																						(
																							timezone,
																							index
																						) => {
																							return (
																								<SelectItem
																									key={
																										index
																									}
																									value={
																										timezone?.zone
																									}
																								>
																									{
																										timezone?.zone
																									}{' '}
																									{
																										timezone?.gmt
																									}
																								</SelectItem>
																							);
																						}
																					)}
																				</SelectContent>
																			</Select>
																		)}
																	/>

																	<FormInput
																		name={`certificates.${index}.institution`}
																		label="Institution"
																		render={({ field }) => (
																			<Select
																				value={field.value}
																				onValueChange={(
																					value
																				) => {
																					if (!value)
																						return;
																					field.onChange(
																						value
																					);
																				}}
																			>
																				<SelectTrigger>
																					<SelectValue placeholder="Select an institution" />
																				</SelectTrigger>
																				<SelectContent>
																					{timezones?.map?.(
																						(
																							timezone,
																							index
																						) => {
																							return (
																								<SelectItem
																									key={
																										index
																									}
																									value={
																										timezone?.zone
																									}
																								>
																									{
																										timezone?.zone
																									}{' '}
																									{
																										timezone?.gmt
																									}
																								</SelectItem>
																							);
																						}
																					)}
																				</SelectContent>
																			</Select>
																		)}
																	/>

																	<Button
																		className="w-fit mt-4"
																		variant="destructive"
																		onClick={() => {
																			setFiles(
																				(
																					prevFiles: any
																				) => {
																					const newFiles =
																						prevFiles.filter(
																							(
																								_: any,
																								i: number
																							) =>
																								i !==
																								index
																						);
																					return newFiles;
																				}
																			);

																			onChange(
																				(
																					files as any
																				)?.filter?.(
																					(
																						_: any,
																						i: number
																					) => i !== index
																				)
																			);
																		}}
																	>
																		remove certificate
																	</Button>
																</div>
															</div>
														);
													})
												: null}
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
