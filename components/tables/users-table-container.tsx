'use server';

import { getAllUsers } from '@/actions/get-all-users';
import { UsersTable } from './users-table';

interface UsersTableContainerProps {
	searchParams: {
		[key: string]: 'neutral' | 'desc' | 'asc';
	};
}
export default async function UsersTableContainer(props: UsersTableContainerProps) {
	// Get the filters from the search params
	const nameFilter = props.searchParams?.['users-name-sort'];
	const emailFilter = props.searchParams?.['users-email-sort'];
	const emailVerifiedFilter = props.searchParams?.['users-emailVerified-sort'];
	const isTwoFactorEnabledFilter = props.searchParams?.['users-isTwoFactorEnabled-sort'];
	const roleFilter = props.searchParams?.['users-role-sort'];
	const createdAtFilter = props.searchParams?.['users-createdAt-sort'] ?? 'desc';

	// Get the users data and pass filters inside
	const data = await getAllUsers({
		pageNum: Number(props.searchParams?.['users-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['users-perPage'] ?? 100),
		search: props.searchParams?.['users-search'] ?? '',
		filters: {
			name: nameFilter,
			email: emailFilter,
			emailVerified: emailVerifiedFilter,
			isTwoFactorEnabled: isTwoFactorEnabledFilter,
			role: roleFilter,
			createdAt: createdAtFilter,
		},
	});

	//Render the users table
	return <UsersTable users={data.users ?? []} totalPages={data?.totalPages} isLoading={false} />;
}
