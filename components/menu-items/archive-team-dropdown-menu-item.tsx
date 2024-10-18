'use client';

import { adminArchiveTeam } from '@/actions/admin-archive-team';
import { Team } from '@/db/drizzle/schema/team';
import { TeamMember } from '@/db/drizzle/schema/teamMember';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { isTeamAuth } from '@/lib/team';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { ButtonProps } from '../ui/button';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { DangerConfirmationDialogWrapper } from '../auth/danger-confirmation-dialog-wrapper';

interface ArchiveTeamDropdownMenuItemProps {
	team: Team;
	visible: boolean;
}

export function ArchiveTeamDropdownMenuItem(props: ArchiveTeamDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { update } = useSession();
	const currentUser = useCurrentUser();

	const { query: ArchiveTeamQuery, isLoading } = useMutation<Team | null, {}>({
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

	const isArchived = !!props.team?.isArchived;
	const title = isArchived ? 'Restore' : 'Archive';
	const description = isArchived
		? `Restoring ${props.team?.name ?? 'this team'}
		will make it visible in the system again. Any subscriptions will resume at the end of the billing period.`
		: `Archiving ${props.team?.name ?? 'this team'}
		will hide it from the system. This action can only be undone by a site administrator. Any subscriptions will terminate at the end of the billing period.`;
	const buttonProps: ButtonProps = isArchived
		? { variant: 'successful' }
		: { variant: 'destructive' };

	if (!props.visible) return null;

	return (
		<DangerConfirmationDialogWrapper
			code={props?.team?.name?.toLowerCase()}
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
