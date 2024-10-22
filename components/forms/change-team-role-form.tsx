'use client';

import { updateTeamMemberRole } from '@/actions/team/update-team-member-role';
import { TeamMember } from '@/db/drizzle/schema/teamMember';
import { useMutation } from '@/hooks/use-mutation';
import { ChangeTeamRoleSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type ChangeTeamRoleFormProps = z.infer<typeof ChangeTeamRoleSchema>;

type TeamsResponse = {
	member: TeamMember;
};

interface ChangeTeamRoleProps {
	member?: TeamMember | null;
	onSubmit?: () => void;
	isOwner?: boolean;
	onCancel: () => void;
}

export function ChangeTeamRoleForm(props: ChangeTeamRoleProps) {
	const { update } = useSession();

	const form = useForm<ChangeTeamRoleFormProps>({
		resolver: zodResolver(ChangeTeamRoleSchema),
		defaultValues: {
			role: props.member?.role ?? 'USER',
		},
	});

	const { query: updateRoleQuery, isLoading: isUpdating } = useMutation<
		ChangeTeamRoleFormProps,
		TeamsResponse
	>({
		queryFn: async (values) =>
			await updateTeamMemberRole(values!, props.member!.userId, props.member!.teamId),
		onCompleted: async (data) => {
			update();
			form.reset({
				role: data?.member?.role ?? 'USER',
			});
		},
	});

	async function onSubmit(values: ChangeTeamRoleFormProps) {
		await updateRoleQuery(values);
		props.onSubmit?.();
	}

	if (!props.member) return null;

	return (
		<div className="">
			{props.isOwner ? (
				<p className="text-muted-foreground text-xs mb-4">
					As the team owner, you can transfer ownership to another team member. If you
					transfer ownership, you will be demoted to an admin.
				</p>
			) : null}
			<div className="space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="role"
							render={(inputProps) => (
								<FormControl className="w-28">
									<FormItem className="w-full">
										<FormLabel>Team role</FormLabel>

										<Select
											onValueChange={(value: 'ADMIN' | 'USER') => {
												form.setValue('role', value);
											}}
											defaultValue={props.member?.role ?? 'USER'}
											disabled={isUpdating}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
											<SelectContent>
												{props.isOwner ? (
													<SelectItem value={'OWNER'}>Owner</SelectItem>
												) : null}
												<SelectItem value={'ADMIN'}>Admin</SelectItem>
												<SelectItem value={'USER'}>User</SelectItem>
											</SelectContent>
										</Select>
									</FormItem>
								</FormControl>
							)}
						/>

						<div className="flex flex-row flex-wrap gap-4 mt-4">
							<div className="flex-1 flex justify-end">
								<Button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										props.onCancel();
									}}
									variant="secondary"
								>
									Cancel
								</Button>
							</div>
							<Button
								type="submit"
								isLoading={isUpdating}
								disabled={isUpdating || form.watch('role') === props.member?.role}
							>
								Update role
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
