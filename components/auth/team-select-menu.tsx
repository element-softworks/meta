'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { setCookie } from '@/data/cookies';
import { ExtendedUser } from '@/next-auth';
import { Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';

interface TeamSelectMenuProps {}
export function TeamSelectMenu(props: TeamSelectMenuProps) {
	const currentUser = useCurrentUser();
	const { setTheme, theme } = useTheme();
	const { update } = useSession();

	const router = useRouter();
	const isLightMode = theme === 'light';

	const updateTeam = currentUser?.teams
		? currentUser?.teams?.find((team) => team.id === currentUser?.currentTeam) ??
		  currentUser?.teams[0]
		: null;

	//set the current team to either the first team or the team stored in cookies
	const [selectedTeam, setSelectedTeam] = useState(updateTeam);
	useEffect(() => {
		setSelectedTeam(updateTeam);
	}, [currentUser]);

	if (!currentUser) return null;

	return (
		<Select
			value={selectedTeam?.id}
			onValueChange={async (value) => {
				if (value === 'manage-teams') {
					router.push('/dashboard/teams');
					return;
				}

				if (value === 'create-team') {
					router.push('/dashboard/teams/create');
					return;
				}

				const team = currentUser?.teams?.find((team) => team.id === value);
				if (team) {
					setSelectedTeam(team);
				}

				//Set the cookie for the default team
				await setCookie({
					name: `${currentUser?.email}-current-team`,
					value: team?.id ?? '',
				});
				update();

				router.push('/dashboard');
			}}
		>
			<SelectTrigger className="w-[53px] md:w-[180px]">
				<Avatar className="size-7">
					{selectedTeam?.image && (
						<AvatarImage
							width={35}
							height={35}
							src={selectedTeam?.image ?? ''}
							alt="user avatar"
						/>
					)}
					<AvatarFallback>{selectedTeam?.name?.slice(0, 2)}</AvatarFallback>
				</Avatar>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{currentUser?.teams
					?.filter((team) => !team?.isArchived)
					?.map?.((team) => (
						<SelectItem className="cursor-pointer" key={team.id} value={team.id}>
							{team.name}
						</SelectItem>
					))}
				<SelectSeparator />
				<SelectItem value="manage-teams" className="cursor-pointer" key="manage-teams">
					Manage teams
				</SelectItem>
				<SelectItem value="create-team" className="cursor-pointer" key="create-team">
					<div className="flex items-center gap-1">
						<Plus size={15} /> Create a team
					</div>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}
