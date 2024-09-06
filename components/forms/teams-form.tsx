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

type TeamsFormInputProps = z.infer<typeof TeamsSchema>;

type SettingsResponse = {
	team: Team;
};

interface TeamsFormProps {
	adminMode?: boolean;
	editingTeam?: Team | null;
}

export function TeamsForm(props: TeamsFormProps) {
	const user = useCurrentUser();
	const { update } = useSession();

	const defaultTeam = props.adminMode ? props.editingTeam : null;

	const form = useForm<TeamsFormInputProps>({
		resolver: zodResolver(TeamsSchema),
		defaultValues: {
			name: defaultTeam?.name ?? '',
			image: undefined,
		},
	});

	const { query: createTeamQuery, isLoading } = useMutation<FormData, SettingsResponse>({
		queryFn: async (values) => await teamCreate(values!),
		onCompleted: async (data) => {
			const response = await update();

			form.reset();
		},
	});

	async function onSubmit(values: TeamsFormInputProps) {
		const formData = new FormData();
		const fileInput = values?.image?.[0]; // Assuming avatar is being returned as a FileList
		formData.append('image', fileInput);
		formData.append('name', values.name);

		if (!values) return;
		if (props.editingTeam) {
			//update team
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
									disabled={isLoading}
									placeholder="John Doe's team"
								/>
							)}
						/>

						<DropzoneInput
							name="image"
							// defaultFiles={!!user?.image ? [user?.image] : undefined}
						/>

						<Button
							type="submit"
							isLoading={isLoading}
							disabled={isLoading || !form.formState.isDirty}
						>
							Create team
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
