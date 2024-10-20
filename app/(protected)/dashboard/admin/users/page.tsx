import { UsersTable } from '@/components/tables/users-table';
import UsersTableContainer from '@/components/tables/users-table-container';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';

export async function generateMetadata() {
	return {
		title: `Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
		description: 'View and manage platform users here',
		openGraph: {
			title: `Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
			description: 'View and manage platform users here',
		},
		twitter: {
			title: `Users | Admin | Dashboard | NextJS SaaS Boilerplate`,
			description: 'View and manage platform users here',
		},
	};
}

export default async function AdminUsersPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Users</p>
				<p className="text-muted-foreground text-sm">View and manage platform users here</p>
			</div>

			<Separator />

			<Suspense fallback={<UsersTable users={[]} totalPages={1} isLoading={true} />}>
				<UsersTableContainer searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
