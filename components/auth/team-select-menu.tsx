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
import { ChartNoAxesGanttIcon, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import plans from '@/plans.json';

interface TeamSelectMenuProps {
	enableBadge: boolean;
}
export function TeamSelectMenu(props: TeamSelectMenuProps) {
	const [selectOpen, setSelectOpen] = useState(false);
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

	const pricingPlans = JSON.parse(JSON.stringify(plans));

	if (!currentUser) return null;

	return (
		<>
			{/* <Badge>{selectedTeam?.stripePaymentId}</Badge> */}
			<Select
				open={selectOpen}
				onOpenChange={(state) => setSelectOpen(state)}
				value={selectedTeam?.id}
				onValueChange={async (value) => {
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
					{!!currentUser?.teams?.length ? (
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
					) : null}

					<SelectValue placeholder="Select a team" />
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
					<Link href="/dashboard/teams" onClick={() => setSelectOpen(false)}>
						<Button
							variant="ghost"
							value="manage-teams"
							className="cursor-pointer w-full font-normal text-sm justify-start"
							key="manage-teams"
						>
							<ChartNoAxesGanttIcon size={18} /> Manage teams
						</Button>
					</Link>
					<Link href="/dashboard/teams/create" onClick={() => setSelectOpen(false)}>
						<Button
							variant="ghost"
							value="manage-teams"
							className="cursor-pointer w-full font-normal text-sm justify-start"
							key="manage-teams"
						>
							<Plus size={18} /> Create a team
						</Button>
					</Link>
				</SelectContent>
			</Select>
		</>
	);
}
