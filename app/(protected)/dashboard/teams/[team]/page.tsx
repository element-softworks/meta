import { InviteUserToTeamDialog } from '@/components/dialogs/invite-user-to-team-dialog';
import { UserLeaveTeamDialog } from '@/components/dialogs/user-leave-team-dialog';
import { TeamsMemberTable } from '@/components/tables/team-members-table';
import TeamMembersTableContainer from '@/components/tables/team-members-table-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getIsUserInTeam } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { getTeamById } from '@/lib/team';
import { UserRole } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DashboardPage({
	params,
	searchParams,
}: {
	params: { team: string };
	searchParams: any;
}) {
	const teamResponse = await getTeamById(params.team);

	const user = await currentUser();
	const isUserInTeam = await getIsUserInTeam(params.team, user?.id ?? '');

	const isTeamAdmin =
		teamResponse.team?.members?.find((member) => member.userId === user?.id)?.role ===
		UserRole.ADMIN;

	if (!isUserInTeam) {
		return redirect('/dashboard/teams');
	}

	return (
		<main className="flex flex-col max-w-4xl gap-6 h-full">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">{teamResponse?.team?.name}</p>
					<p className="text-muted-foreground text-sm">View team details below</p>
				</div>
				{isTeamAdmin ? (
					<Link href={`/dashboard/teams/${params.team}/edit`}>
						<Button className="w-fit">Edit settings</Button>
					</Link>
				) : null}
			</div>
			<Separator />
			<InviteUserToTeamDialog visible={isTeamAdmin} teamId={teamResponse?.team?.id ?? ''} />
			<Suspense fallback={<TeamsMemberTable totalPages={1} isLoading={true} />}>
				<TeamMembersTableContainer teamId={params.team} searchParams={searchParams} />
			</Suspense>

			<div className="mt-auto">
				<UserLeaveTeamDialog teamId={teamResponse?.team?.id ?? ''} />
			</div>
		</main>
	);
}
