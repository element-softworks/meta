'use client';

import { adminArchiveTeam } from '@/actions/admin-archive-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { Button, ButtonProps } from '../ui/button';
import { Team } from '@/db/drizzle/schema/team';
import { DangerConfirmationDialogWrapper } from '../auth/danger-confirmation-dialog-wrapper';

interface ArchiveTeamDialogProps {
	team: Team | undefined;
	isTeamAdmin: boolean;
}

export function ArchiveTeamDialog(props: ArchiveTeamDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { update } = useSession();
	const currentUser = useCurrentUser();

	const { query: ArchiveTeamQuery, isLoading } = useMutation<(Team | undefined) | null, {}>({
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
		will make it visible in the system again`
		: `Archiving ${props.team?.name ?? 'this team'}
		will hide it from the system. This action can only be undone by a team administrator`;
	const buttonProps: ButtonProps = isArchived
		? { variant: 'successful' }
		: { variant: 'destructive' };

	if (!props.isTeamAdmin) return null;

	return (
		// <DialogWrapper
		// 	isLoading={isLoading}
		// 	onOpenChange={(state) => setDialogOpen(state)}
		// 	open={dialogOpen}
		// 	onSubmit={() => handleArchiveTeam()}
		// 	button={
		// 		<Button
		// 			variant={isArchived ? 'successful' : 'destructive'}
		// 			onClick={() => setDialogOpen((prev) => !prev)}
		// 		>
		// 			{isArchived ? 'Restore' : 'Archive'} team
		// 		</Button>
		// 	}
		// 	dialog={{
		// 		title,
		// 		description,
		// 		buttonProps,
		// 	}}
		// />
		<DangerConfirmationDialogWrapper
			code={props?.team?.name?.toLowerCase()}
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleArchiveTeam()}
			button={
				<Button
					variant={isArchived ? 'successful' : 'destructive'}
					onClick={() => setDialogOpen((prev) => !prev)}
				>
					{isArchived ? 'Restore' : 'Archive'} team
				</Button>
			}
			dialog={{
				title,
				description,
				buttonProps,
			}}
		/>
	);
}
