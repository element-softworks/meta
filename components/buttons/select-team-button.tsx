'use client';

import { setCookie } from '@/data/cookies';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSession } from 'next-auth/react';
import { Button } from '../ui/button';

interface SelectTeamButtonProps {
	teamId: string;
	disabled?: boolean;
}
export function SelectTeamButton(props: SelectTeamButtonProps) {
	const { disabled = false } = props;
	const user = useCurrentUser();
	const { update } = useSession();
	return (
		<Button
			disabled={props.disabled}
			variant="secondary"
			className="w-full mt-4 flex-1"
			onClick={async () => {
				if (props.disabled) return;
				await setCookie({
					name: `${user?.id}-current-team`,
					value: props.teamId ?? '',
				});
				update();
			}}
		>
			Select team
		</Button>
	);
}
