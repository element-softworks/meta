import { TeamsTable } from '@/components/tables/teams-table';
import TeamsTableContainer from '@/components/tables/teams-table-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function DashboardPage({ searchParams }: any) {
	const user = await currentUser();
	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Teams overview</p>
					<p className="text-muted-foreground text-sm">Manage your teams below</p>
				</div>
				<Link href="/dashboard/teams/create">
					<Button className="w-fit">Create team</Button>
				</Link>
			</div>
			<Separator />
			<Suspense fallback={<TeamsTable teams={[]} totalPages={1} isLoading={true} />}>
				<TeamsTableContainer userId={user?.id ?? ''} searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
