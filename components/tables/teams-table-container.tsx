'use server';

import { getUsersTeams } from '@/actions/get-users-teams';
import { TeamsTable } from './teams-table';

interface TeamsTableContainerProps {
	searchParams: any;
	userId: string;
}
export default async function TeamsTableContainer(props: TeamsTableContainerProps) {
	// Get the users data and pass filters inside
	const data = await getUsersTeams({
		pageNum: Number(props.searchParams?.['teams-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['teams-perPage'] ?? 100),
		search: props.searchParams?.['teams-search'] ?? '',
		showArchived: (props.searchParams?.['teams-archived'] as 'true' | 'false') ?? 'false',
		userId: props.userId,
	});

	//Render the users table
	return <TeamsTable teams={data.teams ?? []} totalPages={data?.totalPages} isLoading={false} />;
}
