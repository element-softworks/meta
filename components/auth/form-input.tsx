'use client';

import {
	ControllerFieldState,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
	UseFormStateReturn,
	useFormContext,
} from 'react-hook-form';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';

interface FormInputProps {
	visible?: boolean;
	name: string;
	label?: string;
	description?: string;
	render: (props: {
		field: ControllerRenderProps<FieldValues, string>;
		fieldState: ControllerFieldState;
		formState: UseFormStateReturn<FieldValues>;
	}) => JSX.Element;
}

export function FormInput(props: FormInputProps) {
	const { visible = true } = props;
	const { control } = useFormContext();

	if (!visible) {
		return null;
	}

	return (
		<FormField
			control={control}
			name={props.name}
			render={(inputProps) => (
				<FormItem>
					{props.label ? (
						<FormLabel className="text-sm font-normal">{props.label}</FormLabel>
					) : null}
					<FormControl>{props.render({ ...inputProps })}</FormControl>
					{props.description ? (
						<FormDescription>{props.description}</FormDescription>
					) : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
