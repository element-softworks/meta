'use client';

import { $Enums, TeamRole } from '@prisma/client';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { InviteTeamUsersFormInputProps } from '../forms/invite-user-to-team-form';
import { Button } from '../ui/button';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface InviteUsersInputProps {
	name: string;
	isLoading: boolean;
}

export function InviteUsersInput(props: InviteUsersInputProps) {
	const { isLoading = false } = props;
	const { control, register, formState, setValue } =
		useFormContext<InviteTeamUsersFormInputProps>();
	const { fields, insert, update } = useFieldArray({
		control: control, // control props comes from useForm (optional: if you are using FormProvider)
		name: props.name as 'users', // unique name for your Field Array
	});

	return (
		<div className="flex flex-col gap-2">
			{fields.map((field, index) => {
				const hasEmailError = formState.errors.users?.[index]?.email;
				const hasRoleError = formState.errors.users?.[index]?.role;

				return (
					<div key={index} className="flex gap-2">
						<FormField
							control={control}
							name={props.name as 'users'}
							render={(inputProps) => (
								<FormControl className="flex-1">
									<FormItem>
										<Input
											{...register(`${props.name as 'users'}.${index}.email`)}
											key={field.id}
											disabled={isLoading}
											placeholder="john.doe@example.com"
											className={hasEmailError ? 'border-red-500' : ''}
										/>
									</FormItem>
								</FormControl>
							)}
						/>

						<FormField
							control={control}
							name={props.name as 'users'}
							render={(inputProps) => (
								<FormControl className="">
									<FormItem>
										<Input
											{...register(`${props.name as 'users'}.${index}.name`)}
											key={field.id}
											disabled={isLoading}
											placeholder="John Doe"
										/>
									</FormItem>
								</FormControl>
							)}
						/>

						<FormField
							control={control}
							name={props.name as 'users'}
							render={(inputProps) => (
								<FormControl className="w-40">
									<FormItem>
										<Select
											onValueChange={(value: $Enums.TeamRole) => {
												setValue(
													`${props.name as 'users'}.${index}.role`,
													value
												);
											}}
											defaultValue={TeamRole.USER}
											disabled={isLoading}
										>
											<SelectTrigger
												className={hasRoleError ? 'border-red-500' : ''}
											>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={TeamRole.ADMIN}>
													Admin
												</SelectItem>
												<SelectItem value={TeamRole.USER}>User</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								</FormControl>
							)}
						/>
					</div>
				);
			})}

			<Button
				disabled={isLoading}
				className="w-fit"
				variant="secondary"
				type="button"
				onClick={() => {
					insert(fields.length, { email: '', role: TeamRole.USER });
				}}
			>
				Add another user
			</Button>
		</div>
	);
}
