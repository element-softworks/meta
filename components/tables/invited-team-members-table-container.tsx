'use server';

import { getTeamInvitedUsers } from '@/actions/team/get-team-invited-users';
import { InvitedTeamsMemberTable } from './invited-team-members-table';

interface InvitedTeamMembersTableContainerProps {
	searchParams: any;
	teamId: string;
}
export default async function InvitedTeamMembersTableContainer(
	props: InvitedTeamMembersTableContainerProps
) {
	// Get the filters from the search params

	const teamResponse = await getTeamInvitedUsers(
		props.teamId,
		Number(props.searchParams?.['invited-team-members-perPage'] ?? 100),
		Number(props.searchParams?.['invited-team-members-pageNum'] ?? 1),
		props.searchParams?.['invited-team-members-search'] ?? ''
	);

	console.log('teamResponse', teamResponse);

	return (
		<InvitedTeamsMemberTable
			teamMembers={teamResponse?.data ?? []}
			totalPages={teamResponse.totalPages}
			isLoading={false}
		/>
	);
}
