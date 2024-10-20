'use client';

import { userLeaveTeam } from '@/actions/team/user-leave-team';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { User } from 'next-auth';
import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import { Team } from '@/db/drizzle/schema/team';
import { TeamMember } from '@/db/drizzle/schema/teamMember';

interface UserLeaveTeamDialogProps {
	teamId: string;
}

export function UserLeaveTeamDialog(props: UserLeaveTeamDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { update } = useSession();
	const currentUser = useCurrentUser();

	const { query: UserLeaveTeamQuery, isLoading } = useMutation<
		(Team & { members: (TeamMember & { user: User })[] }) | null,
		{}
	>({
		queryFn: async () => await userLeaveTeam(props.teamId ?? ''),
		onCompleted: () => {
			update();
			setDialogOpen(false);
		},
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
