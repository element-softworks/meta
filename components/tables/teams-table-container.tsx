'use server';

import { getTeams } from '@/actions/team/get-teams';
import { TeamsTable } from './teams-table';

interface TeamsTableContainerProps {
	searchParams: any;
	admin: boolean;
}
export default async function TeamsTableContainer(props: TeamsTableContainerProps) {
	// Get the users data and pass filters inside

	const createdAt = props.searchParams?.['teams-createdAt-sort'] ?? 'desc';

	const teamsResponse = (await getTeams({
		pageNum: Number(props.searchParams?.['teams-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['teams-perPage'] ?? 100),
		search: props.searchParams?.['teams-search'] ?? '',
		filters: {
			createdAt,
		},
	})) as { teams: TeamsTable[]; totalPages: number };

	return (
		<TeamsTable
			admin={props.admin}
			teams={teamsResponse.teams ?? []}
			totalPages={teamsResponse?.totalPages ?? 1}
			isLoading={false}
		/>
	);
}
