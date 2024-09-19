'use server';

import { getUsersTeams } from '@/actions/get-users-teams';
import { currentUser } from '@/lib/auth';
import { getCurrentTeamMember } from '@/lib/team';
import { TeamRole } from '@prisma/client';
import Link from 'next/link';
import { AvatarGroup } from './avatar-group';
import { SelectTeamButton } from './buttons/select-team-button';
import { CardWrapper } from './card-wrapper';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface TeamsCardsContainerProps {
	searchParams: any;
	userId: string;
}
export default async function TeamsCardsContainer(props: TeamsCardsContainerProps) {
	// Get the users data and pass filters inside
	const data = await getUsersTeams({
		pageNum: Number(props.searchParams?.['teams-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['teams-perPage'] ?? 100),
		search: props.searchParams?.['teams-search'] ?? '',
		showArchived: (props.searchParams?.['teams-archived'] as 'true' | 'false') ?? 'false',
		userId: props.userId,
	});

	console.log(data, ' cheeeee');

	//Render the users table
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{data?.teams?.map((team, index) => {
				const teamMembersLength = team?.team?.members?.length;
				return (
					<CardWrapper
						key={index}
						title={team?.team?.name}
						description={`This team contains ${teamMembersLength} member${
							teamMembersLength === 1 ? '' : 's'
						}`}
					>
						<Badge className="absolute top-6 right-6">{currentTeamMember?.role}</Badge>
						<div className="flex gap-6 md:gap-4 flex-wrap justify-between">
							<div>
								<p className="text-sm font-semibold ">Members</p>
								<AvatarGroup
									avatars={
										team?.team?.members?.map?.((member) => ({
											alt: member.user?.name ?? '',
											src: member.user?.image ?? '',
										})) ?? []
									}
								/>
							</div>
							<div>
								<p className="text-sm font-semibold">Team owner</p>
								<div className="flex gap-2 items-center">
									{!!teamOwner?.user?.image ? (
										<Avatar className="size-[32px]">
											<AvatarImage src={teamOwner?.user?.image ?? ''} />
										</Avatar>
									) : null}

									<p className="text-sm ">{teamOwner?.user?.name}</p>
								</div>
							</div>
						</div>
						<div className="flex gap-4 w-full ">
							<SelectTeamButton
								teamId={team?.team?.id}
								disabled={team?.team?.id === user?.currentTeam}
							/>
							<Link href={`/dashboard/teams/${team?.team?.id}`} className="flex-1">
								<Button className="w-full mt-4">View team</Button>
							</Link>
						</div>
					</CardWrapper>
				);
			})}
		</div>
	);
}
