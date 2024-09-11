'use client';

import { setCookie } from '@/data/cookies';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';

interface SelectTeamButtonProps {
	teamId: string;
}
export function SelectTeamButton(props: SelectTeamButtonProps) {
	const user = useCurrentUser();
	const { update } = useSession();
	return (
		<Button
			variant="secondary"
			className="w-full mt-4 flex-1"
			onClick={async () => {
				await setCookie({
					name: `${user?.email}-current-team`,
					value: props.teamId ?? '',
				});
				update();
			}}
		>
			Select team
		</Button>
	);
}
