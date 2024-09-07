'use client';

import { adminArchiveTeam } from '@/actions/admin-archive-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { Team, TeamMember, UserRole } from '@prisma/client';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { TableTeam } from '../tables/teams-table';
import { ButtonProps } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';

interface ArchiveTeamDropdownMenuItemProps {
	team: (Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam;
}

export function ArchiveTeamDropdownMenuItem(props: ArchiveTeamDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const currentUser = useCurrentUser();

	const { query: ArchiveTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam,
		{}
	>({
		queryFn: async (team) => await adminArchiveTeam(team!),
		onCompleted: () => setDialogOpen(false),
	});

	const handleArchiveTeam = () => {
		if (!props.team) return;
		ArchiveTeamQuery(props.team);
	};

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAdmin = props.team?.members?.some(
		(member) =>
			(member.userId === currentUser?.id && member.role === UserRole.ADMIN) ||
			currentUser?.role === UserRole.ADMIN
	);

	const isArchived = !!props.team?.isArchived ?? false;

	const title = isArchived ? 'Restore' : 'Archive';
	const description = isArchived
		? `Restoring ${props.team?.name ?? 'this team'}
		will grant them access to the system. This action can only be undone by a site administrator`
		: `Archiving ${props.team?.name ?? 'this team'}
		will remove them from the system and revoke their access. This action can only be undone by a site administrator`;
	const buttonProps: ButtonProps = isArchived
		? { variant: 'successful' }
		: { variant: 'destructive' };

	if (!isTeamAdmin) return null;

	return (
		<DialogWrapper
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleArchiveTeam()}
			dialog={{
				title,
				description,
				buttonProps,
			}}
		>
			<DropdownMenuItem
				onClick={(e) => {
					e.preventDefault();
					setDialogOpen(true);
				}}
				className="cursor-pointer"
			>
				{isArchived ? 'Restore' : 'Archive'} Team
			</DropdownMenuItem>
		</DialogWrapper>
	);
}
