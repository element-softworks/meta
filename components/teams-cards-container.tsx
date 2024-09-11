'use server';

import { getUsersTeams } from '@/actions/get-users-teams';
import { CardWrapper } from './card-wrapper';
import { Badge } from './ui/badge';
import { getCurrentTeamMember, isTeamAuth } from '@/lib/team';
import { AvatarGroup } from './avatar-group';
import { Button } from './ui/button';
import Link from 'next/link';
import { TeamRole } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface TeamsCardsContainerProps {
	searchParams: any;
	userId: string;
}
export default async function TeamsCardsContainer(props: TeamsCardsContainerProps) {
	// Get the filters from the search params
	const nameFilter = props.searchParams?.['teams-name-sort'];
	const createdBy = props.searchParams?.['teams-createdBy-sort'];
	const createdAt = props.searchParams?.['teams-createdAt-sort'];
	const updatedAt = props.searchParams?.['teams-updatedAt-sort'];

	// Get the users data and pass filters inside
	const data = await getUsersTeams({
		pageNum: Number(props.searchParams?.['teams-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['teams-perPage'] ?? 100),
		search: props.searchParams?.['teams-search'] ?? '',
		showArchived: (props.searchParams?.['teams-archived'] as 'true' | 'false') ?? 'false',
		userId: props.userId,
		filters: {
			name: nameFilter,
			createdBy: createdBy,
			createdAt: createdAt,
			updatedAt: updatedAt,
		},
	});

	//Render the users table
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{data?.teams?.map((team, index) => {
				const currentTeamMember = getCurrentTeamMember(
					team?.team?.members ?? [],
					props.userId
				);

				const teamOwner = team?.team?.members?.find(
					(member) => member.role === TeamRole.OWNER
				);

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
						<div className="flex gap-4 w-full">
							<Link href={`/dashboard/teams/${team?.team?.id}`} className="flex-1">
								<Button variant="secondary" className="w-full mt-4">
									Select team
								</Button>
							</Link>
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
