'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ExtendedUser } from '@/next-auth';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface TeamSelectMenuProps {
	user: ExtendedUser | undefined;
}
export function TeamSelectMenu(props: TeamSelectMenuProps) {
	const { setTheme, theme } = useTheme();

	const router = useRouter();
	const isLightMode = theme === 'light';

	//set the current team to either the first team or the team stored in cookies

	const [selectedTeam, setSelectedTeam] = useState(
		props.user?.teams ? props.user?.teams[0] : null
	);

	if (!props.user) return null;

	return (
		<Select
			value={selectedTeam?.id}
			onValueChange={(value) => {
				if (value === 'manage-teams') {
					router.push('/dashboard/teams');
					return;
				}

				if (value === 'create-team') {
					router.push('/dashboard/teams/create');
					return;
				}

				const team = props.user?.teams?.find((team) => team.id === value);
				if (team) {
					setSelectedTeam(team);
				}

				router.push('/dashboard');
			}}
		>
			<SelectTrigger className="w-[180px]">
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
				{props.user?.teams?.map?.((team) => (
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
