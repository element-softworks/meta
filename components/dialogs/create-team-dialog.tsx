'use client';

import { setCookie } from '@/data/cookies';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect, useState } from 'react';
import { DialogWrapper } from '../auth/dialog-wrapper';
import { TeamsForm } from '../forms/teams-form';

interface CreateTeamDialogProps {
	hasCreateCookie: boolean | undefined;
}
export function CreateTeamDialog(props: CreateTeamDialogProps) {
	const user = useCurrentUser();
	const [dialogOpen, setDialogOpen] = useState(!user?.teams?.length && !props.hasCreateCookie);

	useEffect(() => {
		//Set cookie to flag whether the user has already had this dialog open so it doesnt spam them.
		if (!dialogOpen) return;
		setCookie({
			name: `${user?.email}-create-team-dialog`,
			value: 'true',
		});
	}, [dialogOpen]);

	return (
		<DialogWrapper
			size="lg"
			onSubmit={() => {}}
			isLoading={false}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			disableActions
			dialog={{
				title: 'Create a team',
				description: 'Create a team to get started',
			}}
		>
			<TeamsForm onSubmit={() => setDialogOpen(false)} />
		</DialogWrapper>
	);
}
