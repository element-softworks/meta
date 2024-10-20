'use client';

import { useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { Button } from '../ui/button';
import { InviteUserToTeamForm } from '../forms/invite-user-to-team-form';

interface InviteUserToTeamDialogProps {
	teamId: string;
	visible: boolean;
}
export function InviteUserToTeamDialog(props: InviteUserToTeamDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	if (!props.visible) return null;
	return (
		<DialogWrapper
			size="lg"
			onSubmit={() => {}}
			isLoading={false}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			button={
				<Button className="w-fit" onClick={() => setDialogOpen((prev) => !prev)}>
					Invite users
				</Button>
			}
			disableActions
			dialog={{
				title: 'Invite users',
				description: 'Invite users to your team here',
			}}
		>
			<InviteUserToTeamForm teamId={props.teamId} onFinish={() => setDialogOpen(false)} />
		</DialogWrapper>
	);
}
