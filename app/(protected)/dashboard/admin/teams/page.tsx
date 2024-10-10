import { TeamsTable } from '@/components/tables/teams-table';
import TeamsTableContainer from '@/components/tables/teams-table-container';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import { Suspense } from 'react';

export default async function AdminTeamsPage({ searchParams }: { searchParams: any }) {
	const user = await currentUser();
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Teams</p>
				<p className="text-muted-foreground text-sm">View and manage platform teams here</p>
			</div>

			<Separator />

			<Suspense
				fallback={
					<TeamsTable
						admin={user?.role === 'ADMIN'}
						teams={[]}
						totalPages={1}
						isLoading={true}
					/>
				}
			>
				<TeamsTableContainer searchParams={searchParams} admin={user?.role === 'ADMIN'} />
			</Suspense>
		</main>
	);
}
