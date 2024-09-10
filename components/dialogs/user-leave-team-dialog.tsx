'use client';

import { userLeaveTeam } from '@/actions/user-leave-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { Team, TeamMember } from '@prisma/client';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { TableTeam } from '../tables/teams-table';
import { Button } from '../ui/button';

interface UserLeaveTeamDialogProps {
	teamId: string;
}

export function UserLeaveTeamDialog(props: UserLeaveTeamDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const currentUser = useCurrentUser();

	const { query: UserLeaveTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null | TableTeam,
		{}
	>({
		queryFn: async () => await userLeaveTeam(props.teamId ?? ''),
		onCompleted: () => setDialogOpen(false),
	});

	const handleUserLeaveTeam = () => {
		if (!props.teamId) return;
		UserLeaveTeamQuery();
	};

	return (
		<DialogWrapper
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleUserLeaveTeam()}
			button={
				<Button
					variant="destructive"
					onClick={(e) => {
						e.preventDefault();
						setDialogOpen(true);
					}}
				>
					Leave team
				</Button>
			}
			dialog={{
				title: 'Leave team',
				description:
					'Are you sure you want to leave this team? You will lose access to all team resources and can only be re-added by a team admin',
				buttonProps: {
					variant: 'destructive',
				},
			}}
		/>
	);
}
