'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { SettingsSchema, TeamsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Team } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FormInput } from '../auth/form-input';
import { DropzoneInput } from '../inputs/dropzone-input';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { teamCreate } from '@/actions/team-create';
import { teamUpdate } from '@/actions/team-update';
import { useRouter } from 'next/navigation';

type TeamsFormInputProps = z.infer<typeof TeamsSchema>;

type TeamsResponse = {
	team: Team;
};

interface TeamsFormProps {
	editMode?: boolean;
	editingTeam?: Team | null;
}

export function TeamsForm(props: TeamsFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();
	const router = useRouter();

	const defaultTeam = props.editMode ? props.editingTeam : null;

	const form = useForm<TeamsFormInputProps>({
		resolver: zodResolver(TeamsSchema),
		defaultValues: {
			name: defaultTeam?.name ?? '',
			image: undefined,
		},
	});

	const { query: createTeamQuery, isLoading: isCreating } = useMutation<FormData, TeamsResponse>({
		queryFn: async (values) => await teamCreate(values!),
		onCompleted: async (data) => {
			const response = await update();
			form.reset();
		},
		onSuccess: async (data) => {
			await router.push(`/dashboard/teams/${data?.team?.id}`);
		},
	});

	const { query: updateTeamQuery, isLoading: isUpdating } = useMutation<FormData, TeamsResponse>({
		queryFn: async (values) => await teamUpdate(values!, defaultTeam?.id!),
		onCompleted: async (data) => {
			form.reset({
				name: data?.team?.name ?? '',
				image: undefined,
			});
		},
	});

	async function onSubmit(values: TeamsFormInputProps) {
		const formData = new FormData();
		const fileInput = values?.image?.[0]; // Assuming avatar is being returned as a FileList
		formData.append('image', fileInput);
		formData.append('name', values.name);

		if (!values) return;
		if (props.editMode) {
			//update team
			const response = await updateTeamQuery(formData);
		} else {
			//create team
			const response = await createTeamQuery(formData);
		}
	}

	return (
		<div className="">
			<div className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormInput
							name="name"
							label="Name"
							render={({ field }) => (
								<Input
									{...field}
									disabled={isCreating || isUpdating}
									placeholder="John Doe's team"
								/>
							)}
						/>

						<DropzoneInput
							name="image"
							defaultFiles={!!defaultTeam?.image ? [defaultTeam?.image] : undefined}
						/>

						<Button
							type="submit"
							isLoading={isCreating || isUpdating}
							disabled={isCreating || isUpdating || !form.formState.isDirty}
						>
							{!!props.editingTeam ? 'Update team settings' : 'Create team'}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
