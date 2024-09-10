'use client';

import { InviteTeamUserSingleSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { $Enums, TeamRole } from '@prisma/client';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import * as z from 'zod';
import { InviteTeamUsersFormInputProps } from '../forms/invite-user-to-team-form';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormInput } from '../auth/form-input';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { XIcon } from 'lucide-react';

interface InviteUsersInputProps {
	name: string;
	isLoading: boolean;
}

type InviteTeamUserSingle = z.infer<typeof InviteTeamUserSingleSchema>;

export function InviteUsersInput(props: InviteUsersInputProps) {
	const { isLoading = false } = props;
	const { control, register, formState, setValue } =
		useFormContext<InviteTeamUsersFormInputProps>();
	const { fields, insert, update, remove } = useFieldArray({
		control: control, // control props comes from useForm (optional: if you are using FormProvider)
		name: props.name as 'users', // unique name for your Field Array
	});

	const form = useForm<InviteTeamUserSingle>({
		resolver: zodResolver(InviteTeamUserSingleSchema),
		defaultValues: {
			email: '',
			role: 'USER',
			name: '',
		},
	});

	async function onSubmit(values: InviteTeamUserSingle) {
		if (!values) return;

		insert(fields?.length, {
			email: values.email,
			role: values.role,
			name: values.name,
		});

		form.reset({
			email: '',
			role: 'USER',
			name: '',
		});
	}

	console.log(form.formState.errors, 'errors');

	return (
		<div className="flex flex-col gap-2">
			<div className="">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex gap-2 w-full flex-wrap"
					>
						<div className="flex-1 ">
							<FormInput
								name="email"
								label="Email"
								render={({ field }) => (
									<Input
										{...field}
										disabled={isLoading}
										placeholder="john.doe@example.com"
										// className={hasEmailError ? 'border-red-500' : ''}
									/>
								)}
							/>
						</div>

						<FormInput
							name="name"
							label="Name"
							render={({ field }) => (
								<Input {...field} disabled={isLoading} placeholder="John Doe" />
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={(inputProps) => (
								<FormControl className="w-28">
									<FormItem>
										<FormLabel>Team role</FormLabel>

										<Select
											onValueChange={(value: $Enums.TeamRole) => {
												form.setValue('role', value);
											}}
											defaultValue={TeamRole.USER}
											disabled={isLoading}
										>
											<SelectTrigger
											// className={hasRoleError ? 'border-red-500' : ''}
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

						<Button
							disabled={isLoading}
							className="w-fit mt-auto"
							variant="secondary"
							onClick={form.handleSubmit(onSubmit)}
						>
							Add
						</Button>
					</form>
				</Form>
			</div>

			<div className="flex gap-2 flex-col mt-4">
				{fields.map((field, index) => {
					const hasEmailError = formState.errors.users?.[index]?.email;
					const hasRoleError = formState.errors.users?.[index]?.role;

					return (
						<Card key={field.id} className="flex gap-2">
							<CardContent className="flex flex-col md:flex-row gap-2 md:items-center p-2 w-full relative">
								<div className="flex-1 gap-2 md:gap-4 flex items-center flex-wrap">
									<p className="whitespace-nowrap">{field.email}</p>

									<Badge className="h-6" variant="default">
										{field.role}
									</Badge>
								</div>
								<Button
									variant="ghost"
									className="absolute right-0 top-0 md:top-1/2 md:-translate-y-1/2 cursor-pointer px-2"
								>
									<XIcon
										className=""
										onClick={() => {
											remove(index);
										}}
									/>
								</Button>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
