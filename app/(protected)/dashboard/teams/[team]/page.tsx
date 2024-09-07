import { TeamsMemberTable } from '@/components/tables/team-members-table';
import TeamMembersTableContainer from '@/components/tables/team-members-table-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/lib/team';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function DashboardPage({
	params,
	searchParams,
}: {
	params: { team: string };
	searchParams: any;
}) {
	const teamResponse = await getTeamById(params.team);

	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">{teamResponse?.team?.name}</p>
					<p className="text-muted-foreground text-sm">Manage your team below</p>
				</div>
				<Link href={`/dashboard/teams/${params.team}/edit`}>
					<Button className="w-fit">Edit settings</Button>
				</Link>{' '}
			</div>
			<Separator />
			<Suspense fallback={<TeamsMemberTable totalPages={1} isLoading={true} />}>
				<TeamMembersTableContainer teamId={params.team} searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
