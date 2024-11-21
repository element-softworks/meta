'use server';

import { getAllUsers } from '@/actions/account/get-all-users';
import { UsersTable } from './users-table';
import { Suspense } from 'react';

interface UsersTableContainerProps {
	searchParams: {
		[key: string]: 'neutral' | 'desc' | 'asc';
	};
}
export default async function UsersTableContainer(props: UsersTableContainerProps) {
	// Get the filters from the search params
	const createdAtFilter = props.searchParams?.['users-createdAt-sort'] ?? 'desc';

	// Get the users data and pass filters inside
	const data = await getAllUsers({
		pageNum: Number(props.searchParams?.['users-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['users-perPage'] ?? 100),
		search: props.searchParams?.['users-search'] ?? '',
		showArchived: (props.searchParams?.['users-archived'] as 'true' | 'false') ?? 'false',
		filters: {
			createdAt: createdAtFilter,
		},
	});

	//Render the users table
	return <UsersTable users={data?.users ?? []} totalPages={data?.totalPages} isLoading={false} />;
}
