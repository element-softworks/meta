'use client';
import Image from 'next/image';
import React, { useEffect } from 'react';
import Dropzone, { Accept } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';

interface DropzoneInputProps {
	name: string;
	multiple?: boolean;
	accept?: Accept | undefined;
	defaultFiles?: string[];
	isLoading?: boolean;
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
					<Dropzone
						multiple={multiple}
						onDrop={(acceptedFiles) => {
							setFiles(acceptedFiles);
							onChange(acceptedFiles);
						}}
						accept={{
							'image/*': [], // Accept all image types
						}}
					>
						{({ getRootProps, getInputProps, acceptedFiles }) => {
							return (
								<>
									<section className="">
										<div
											{...getRootProps()}
											className={`group border-2 flex-col gap-2 h-60 border-dashed flex items-center justify-center transition cursor-pointer ${
												!!error
													? 'border-destructive'
													: 'hover:border-primary hover:bg-primary-foreground'
											}`}
										>
											<input
												{...getInputProps({
													onChange: (e) => {
														return onChange(e.target.files);
													},
												})}
											/>
											{(files?.length ?? 0) === 1
												? files?.map?.((file, index) => {
														const objectUrl =
															typeof file === 'string'
																? file
																: URL.createObjectURL(file);
														return (
															<Image
																className="w-[75px] h-[75px] object-cover rounded-full"
																key={index}
																src={objectUrl}
																alt="Dropzone image"
																width={75}
																height={75}
															/>
														);
												  })
												: null}
											<p
												className={`text-center px-2 ${
													!!error
														? 'text-destructive'
														: `text-muted-foreground group-hover:text-primary`
												} transition`}
											>
												{!!error
													? (error as any).avatar.message
													: 'Drag and drop some files here, or click to select files'}
											</p>
										</div>
									</section>
									<div className="flex gap-2 flex-wrap">
										{(files?.length ?? 0) > 1
											? files?.map?.((file, index) => {
													const objectUrl =
														typeof file === 'string'
															? file
															: URL.createObjectURL(file);
													return (
														<Image
															className="w-[105px] h-[105px] object-cover rounded-md"
															key={index}
															src={objectUrl}
															alt={`Dropzone image ${index}`}
															width={100}
															height={100}
														/>
													);
											  })
											: null}
									</div>
								</>
							);
						}}
					</Dropzone>
				)}
			/>
		</>
	);
}
