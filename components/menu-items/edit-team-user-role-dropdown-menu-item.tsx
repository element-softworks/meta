'use client';

import { TeamMemberResponse } from '@/actions/team/get-team-with-members';
import { removeUserFromTeam } from '@/actions/team/remove-user-from-team';
import { Team } from '@/db/drizzle/schema/team';
import { TeamMember } from '@/db/drizzle/schema/teamMember';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { isTeamAuth } from '@/lib/team';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { ChangeTeamRoleForm } from '../forms/change-team-role-form';

interface EditTeamUserRoleDropdownMenuItemProps {
	teamId: string;
	userId: string;
	teamMembers: TeamMemberResponse;
	teamMember: TeamMember;
}

export function EditTeamUserRoleDropdownMenuItem(props: EditTeamUserRoleDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const currentUser = useCurrentUser();

	const { query: RemoveUserFromTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null,
		{}
	>({
		queryFn: async () => await removeUserFromTeam(props.teamId ?? '', props.userId),
		onCompleted: () => setDialogOpen(false),
	});

	const handleRemoveUserFromTeam = () => {
		if (!props.teamId) return;
		RemoveUserFromTeamQuery();
	};

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAdmin = isTeamAuth(
		props.teamMembers?.map((t) => t.member as TeamMember) ?? [],
		currentUser?.id ?? ''
	);

	const teamOwner = props?.teamMembers?.find((t) => t?.member?.role === 'OWNER');
	if (!isTeamAdmin && currentUser?.role !== 'ADMIN') return null;

	if (teamOwner?.member?.userId === props.teamMember.userId) return null;

	return (
		<DialogWrapper
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleRemoveUserFromTeam()}
			disableActions
			button={
				<DropdownMenuItem
					onClick={(e) => {
						e.preventDefault();
						setDialogOpen(true);
					}}
					className="cursor-pointer"
				>
					Edit role
				</DropdownMenuItem>
			}
			dialog={{
				title: 'Edit role',
				description: 'Are you sure you want to edit this users role?',
			}}
		>
			<ChangeTeamRoleForm
				onCancel={() => setDialogOpen(false)}
				member={props.teamMember}
				isOwner={
					props?.teamMembers?.find((t) => t?.member?.userId === currentUser?.id)?.member
						?.role === 'OWNER' || currentUser?.role === 'ADMIN'
				}
			/>
		</DialogWrapper>
	);
}
