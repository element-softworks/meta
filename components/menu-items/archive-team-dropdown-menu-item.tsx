'use client';

import { adminArchiveTeam } from '@/actions/admin-archive-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { isTeamAuth } from '@/lib/team';
import { Team, TeamMember } from '@prisma/client';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { TableTeam } from '../tables/teams-table';
import { ButtonProps } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { useSession } from 'next-auth/react';

interface ArchiveTeamDropdownMenuItemProps {
	team: (Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam;
}

export function ArchiveTeamDropdownMenuItem(props: ArchiveTeamDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { update } = useSession();
	const currentUser = useCurrentUser();

	const { query: ArchiveTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam,
		{}
	>({
		queryFn: async (team) => await adminArchiveTeam(team!),
		onCompleted: () => {
			update();
			setDialogOpen(false);
		},
	});

	const handleArchiveTeam = () => {
		if (!props.team) return;
		ArchiveTeamQuery(props.team);
	};

	//If you are a team admin, or a site admin, you can archive/restore a team
	const isTeamAdmin = isTeamAuth(props.team?.members ?? [], currentUser?.id ?? '');

	const isArchived = !!props.team?.isArchived ?? false;

	const title = isArchived ? 'Restore' : 'Archive';
	const description = isArchived
		? `Restoring ${props.team?.name ?? 'this team'}
		will make it visible in the system again`
		: `Archiving ${props.team?.name ?? 'this team'}
		will hide it from the system. This action can only be undone by a team administrator`;
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
			button={
				<DropdownMenuItem
					onClick={(e) => {
						e.preventDefault();
						setDialogOpen(true);
					}}
					className="cursor-pointer"
				>
					{isArchived ? 'Restore' : 'Archive'} Team
				</DropdownMenuItem>
			}
			dialog={{
				title,
				description,
				buttonProps,
			}}
		/>
	);
}
