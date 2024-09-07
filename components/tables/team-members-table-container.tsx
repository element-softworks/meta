'use server';

import { getTeamWithMembers } from '@/actions/get-team-with-members';
import { TeamsMemberTable } from './team-members-table';

interface TeamMembersTableContainerProps {
	searchParams: any;
	teamId: string;
}
export default async function TeamMembersTableContainer(props: TeamMembersTableContainerProps) {
	// Get the filters from the search params
	const nameFilter = props.searchParams?.['team-members-name-sort'];
	const emailFilter = props.searchParams?.['team-members-email-sort'];
	const teamRoleFilter = props.searchParams?.['team-members-role-sort'];
	const createdAtFilter = props.searchParams?.['team-members-created-at-sort'];

	const teamResponse = await getTeamWithMembers({
		teamId: props.teamId,
		pageNum: Number(props.searchParams?.['team-members-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['team-members-perPage'] ?? 100),
		search: props.searchParams?.['team-members-search'] ?? '',
		showArchived:
			(props.searchParams?.['team-members-archived'] as 'true' | 'false') ?? 'false',
		filters: {
			name: nameFilter,
			email: emailFilter,
			role: teamRoleFilter,
			createdAt: createdAtFilter,
		},
	});

	//Render the users table
	return (
		<TeamsMemberTable
			teamMembers={teamResponse.team?.members ?? []}
			totalPages={teamResponse.totalPages}
			isLoading={false}
		/>
	);
}
