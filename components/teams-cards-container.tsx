'use server';

import { getUsersTeams } from '@/actions/team/get-users-teams';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';
import { AvatarGroup } from './general/avatar-group';
import { SelectTeamButton } from './buttons/select-team-button';
import { CardWrapper } from './general/card-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Image from 'next/image';

interface TeamsCardsContainerProps {
	searchParams: any;
	userId: string;
}
export default async function TeamsCardsContainer(props: TeamsCardsContainerProps) {
	const user = await currentUser();
	// Get the users data and pass filters inside
	const data = await getUsersTeams({
		pageNum: Number(props.searchParams?.['teams-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['teams-perPage'] ?? 100),
		search: props.searchParams?.['teams-search'] ?? '',
		showArchived: (props.searchParams?.['teams-archived'] as 'true' | 'false') ?? 'false',
		userId: props.userId,
	});

	//Render the users table
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{data?.data?.map((teamData, index) => {
				const currentUserRole = teamData?.team.members?.find?.(
					(member) => member.details?.id === user?.id
				);

				const teamOwner = teamData?.team?.members?.find?.(
					(member) => member.role === 'OWNER'
				);
				const teamMembersLength = teamData?.team?.members?.length;
				return (
					<CardWrapper
						startAdornment={
							teamData?.team?.image ? (
								<Image
									className="rounded-full"
									referrerPolicy="no-referrer"
									width={35}
									height={35}
									src={teamData?.team?.image ?? ''}
									alt="user avatar"
								/>
							) : null
						}
						key={index}
						title={teamData?.team?.name}
						description={`This team contains ${teamMembersLength} member${
							teamMembersLength === 1 ? '' : 's'
						}`}
					>
						<Badge className="absolute top-0 right-0 rounded-none md:rounded-lg rounded-bl-lg md:top-4 md:right-4">
							{currentUserRole?.role}
						</Badge>
						<div className="flex gap-4 md:gap-4 flex-wrap justify-between">
							<div>
								<p className="text-sm font-semibold mb-2">Members</p>
								<AvatarGroup
									avatars={
										teamData?.team?.members?.map?.((member) => ({
											alt: member.details?.name ?? '',
											src: member.details?.image ?? '',
										})) ?? []
									}
								/>
							</div>
							<div>
								<p className="text-sm font-semibold mb-2">Team owner</p>
								<div className="flex gap-2 items-center">
									<Avatar key={index} className="relative size-[32px]">
										{teamOwner?.details?.image && (
											<AvatarImage
												width={35}
												height={35}
												src={teamOwner?.details?.image}
												alt="user avatar"
											/>
										)}
										<AvatarFallback>
											{teamOwner?.details?.name?.slice(0, 2)}
										</AvatarFallback>
									</Avatar>

									<p className="text-sm ">{teamOwner?.details?.name}</p>
								</div>
							</div>
						</div>
						<div className="flex gap-4 w-full ">
							<SelectTeamButton
								teamId={teamData?.team?.id}
								disabled={teamData?.team?.id === user?.currentTeam}
							/>
							<Link
								href={`/dashboard/teams/${teamData?.team?.id}`}
								className="flex-1"
							>
								<Button className="w-full mt-4">View team</Button>
							</Link>
						</div>
					</CardWrapper>
				);
			})}
		</div>
	);
}
