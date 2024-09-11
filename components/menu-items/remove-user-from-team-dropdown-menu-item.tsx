'use client';

import { removeUserFromTeam } from '@/actions/remove-user-from-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { isTeamAuth } from '@/lib/team';
import { Team, TeamMember } from '@prisma/client';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { TableTeam } from '../tables/teams-table';
import { DropdownMenuItem } from '../ui/dropdown-menu';

interface RemoveUserFromTeamDropdownMenuItemProps {
	teamId: string;
	userId: string;
	teamMembers: (TeamMember & { user: User })[];
}

export function RemoveUserFromTeamDropdownMenuItem(props: RemoveUserFromTeamDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const currentUser = useCurrentUser();

	const { query: RemoveUserFromTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam,
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
	const isTeamAdmin = isTeamAuth(props.teamMembers ?? [], currentUser?.id ?? '');

	if (!isTeamAdmin) return null;

	return (
		<DialogWrapper
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleRemoveUserFromTeam()}
			button={
				<DropdownMenuItem
					onClick={(e) => {
						e.preventDefault();
						setDialogOpen(true);
					}}
					className="cursor-pointer"
				>
					Remove user
				</DropdownMenuItem>
			}
			dialog={{
				title: 'Remove user from team',
				description: 'Are you sure you want to remove this user from the team?',
				buttonProps: {
					variant: 'destructive',
				},
			}}
		/>
	);
}