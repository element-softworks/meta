'use client';
import React, { ChangeEventHandler, useCallback, useEffect } from 'react';
import Dropzone, { Accept, useDropzone } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';
import { FormInput } from '../auth/form-input';
import { Input } from '../ui/input';
import Image from 'next/image';

interface DropzoneInputProps {
	name: string;
	multiple?: boolean;
	accept?: Accept | undefined;
	defaultFiles?: string[];
}

export function DropzoneInput(props: DropzoneInputProps) {
	const { multiple = false } = props;
	const { setValue, trigger, control, formState, watch } = useFormContext();

	const [files, setFiles] = React.useState<(File[] | string[]) | null>(
		props.defaultFiles ?? null
	);

	useEffect(() => {
		if (!watch(props.name)) {
			setFiles(null);
		}

		if (props.defaultFiles && !watch(props.name)) {
			setFiles(props.defaultFiles);
		}
	}, [watch(props.name), props.defaultFiles]);

	console.log('files', files);
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
											className="group border-2 flex-col gap-2 h-60 border-dashed flex items-center justify-center hover:border-primary transition cursor-pointer"
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
																alt="avatar"
																width={75}
																height={75}
															/>
														);
												  })
												: null}
											<p className="text-muted-foreground group-hover:text-primary transition">
												Drag 'n' drop some files here, or click to select
												files
											</p>
										</div>
									</section>
									{(files?.length ?? 0) > 1
										? files?.map?.((file, index) => {
												const objectUrl =
													typeof file === 'string'
														? file
														: URL.createObjectURL(file);
												return (
													<Image
														className="w-[100px] h-[100px] object-cover"
														key={index}
														src={objectUrl}
														alt="avatar"
														width={100}
														height={100}
													/>
												);
										  })
										: null}
								</>
							);
						}}
					</Dropzone>
				)}
			/>
		</>
	);
}
