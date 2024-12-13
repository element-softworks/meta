'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Dropzone, { Accept } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabel } from '../ui/form';
import { ChevronDownCircle, Trash } from 'lucide-react';

interface DropzoneInputProps {
	name: string;
	multiple?: boolean;
	accept?: Accept | undefined;
	defaultFiles?: string[];
	isLoading?: boolean;
	label?: string;
	required?: boolean;
}

export function DropzoneInput(props: DropzoneInputProps) {
	const { multiple = false } = props;
	const { control, formState, watch } = useFormContext();

	const [files, setFiles] = React.useState<(File[] | string[]) | null>(
		props.defaultFiles ?? null
	);

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
								className={`${!!error ? 'text-destructive' : ''} flex gap-0.5`}
							>
								{props.label}
								{!!props.required ? (
									<p className="text-destructive">*</p>
								) : null}{' '}
							</FormLabel>
						) : null}

						<Dropzone
							multiple={multiple}
							onDrop={(acceptedFiles) => {
								setFiles(acceptedFiles);
								onChange(acceptedFiles);
							}}
							accept={{
								'image/webp': [],
								'image/png': [],
								'image/jpeg': [],
								'image/jpg': [],
								'image/gif': [],
							}}
						>
							{({ getRootProps, getInputProps, acceptedFiles }) => {
								return (
									<>
										<div
											className={`grid grid-cols-2 gap-2 ${
												!!((files?.length ?? 0) > 0) ? 'mt-4' : ''
											}`}
										>
											{(files?.length ?? 0) > 0
												? files?.map?.((file, index) => {
														const objectUrl =
															typeof file === 'string'
																? file
																: URL.createObjectURL(file);
														return (
															<div className="relative aspect-square">
																<Image
																	className="w-full h-full object-cover rounded-md"
																	key={index}
																	src={objectUrl}
																	alt={`Dropzone image ${index}`}
																	width={100}
																	height={100}
																/>
																<div className="bg-black opacity-50 absolute top-0 left-0 w-full h-full z-20 dark:opacity-50" />

																<div className="w-full h-full flex flex-col justify-end py-1 px-2 mt-auto absolute bottom-0 z-30">
																	<div>
																		<p className=" z-30 mt-auto line-clamp-2 text-primary-foreground">
																			{typeof file ===
																			'string'
																				? file
																				: file.name}
																		</p>
																		<div className="flex gap-2">
																			<Trash
																				onClick={() => {
																					setFiles(
																						files?.filter(
																							(
																								_,
																								i
																							) =>
																								i !==
																								index
																						) as File[]
																					);
																					onChange(
																						files?.filter(
																							(
																								_,
																								i
																							) =>
																								i !==
																								index
																						)
																					);
																				}}
																				size={20}
																				className="absolute top-2 cursor-pointer text-primary-foreground right-2"
																			/>
																			<p className="text-sm flex-1 z-30 mt-auto text-white dark:text-muted-foreground">
																				Image
																			</p>

																			<p className="text-sm z-30 mt-auto text-white dark:text-muted-foreground">
																				{typeof file ===
																				'string'
																					? ''
																					: `${(
																							file.size /
																							1000
																					  ).toFixed(
																							0
																					  )} kb`}
																			</p>
																		</div>
																	</div>
																</div>
															</div>
														);
												  })
												: null}
										</div>
										<section className="mt-2 ">
											<div
												{...getRootProps()}
												className={`group/dropzone border-2 flex-col gap-2 h-32 rounded-lg border-dashed flex items-center justify-center transition cursor-pointer ${
													!!error
														? 'border-destructive'
														: 'hover:border-primary hover:bg-card'
												}`}
											>
												<input
													{...getInputProps({
														onChange: (e) => {
															return onChange(e.target.files);
														},
													})}
												/>

												<p
													className={`text-center font-medium text-primary-500 dark:text-primary-100 px-2 ${
														!!error
															? '!text-destructive'
															: `text-muted-foreground group-hover/dropzone:text-primary`
													} transition`}
												>
													{!!error
														? (error as any)?.message ??
														  (error as any)?.image?.message
														: 'Drop an image here or click to select files.'}
												</p>
												<ChevronDownCircle
													size={35}
													className={`text-primary-500 transition ${
														!!error
															? '!text-destructive'
															: `text-muted-foreground group-hover/dropzone:text-primary`
													}`}
												/>
											</div>
										</section>
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
