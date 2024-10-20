import Banner from '@/components/general/banner';
import { InviteUserToTeamDialog } from '@/components/dialogs/invite-user-to-team-dialog';
import { UserLeaveTeamDialog } from '@/components/dialogs/user-leave-team-dialog';
import { TeamsMemberTable } from '@/components/tables/team-members-table';
import TeamMembersTableContainer from '@/components/tables/team-members-table-container';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata({ params }: any) {
	const teamResponse = await getTeamById(params.team);
	return {
		title: `${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
		description: 'Team for NextJS SaaS Boilerplate.',
		openGraph: {
			title: `${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Team for NextJS SaaS Boilerplate.',
		},
		twitter: {
			title: `${teamResponse?.data?.team.name} | Teams | Dashboard | NextJS SaaS Boilerplate`,
			description: 'Team overview for NextJS SaaS Boilerplate.',
		},
	};
}

export default async function TeamPage({
	params,
	searchParams,
}: {
	params: { team: string };
	searchParams: any;
}) {
	const user = await currentUser();
	const teamResponse = await getTeamById(params.team);
	const isAdmin = user?.role === 'ADMIN';

	const isTeamAdmin =
		teamResponse?.data?.currentMember?.role === 'ADMIN' ||
		teamResponse?.data?.currentMember?.role === 'OWNER';
	const isOwner = teamResponse?.data?.currentMember?.role === 'OWNER';

	const isInTeam = !!teamResponse?.data?.currentMember;

	if (!isAdmin) {
		if (
			!teamResponse?.data?.currentMember ||
			(teamResponse?.data?.team?.isArchived && !isTeamAdmin)
		) {
			return redirect('/dashboard/teams');
		}
	}

	return (
		<main className="flex flex-col  gap-4 h-full">
			<Banner
				id={teamResponse?.data?.team?.id ?? ''}
				variant="destructive"
				message={teamResponse?.data?.team.isArchived ? 'This team is archived.' : ''}
				description="You will not be able to interact with this team. Only the team owner can urarchive a team. If you believe this is a mistake, please contact the team owner."
			/>

			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">{teamResponse?.data?.team.name}</p>
					<p className="text-muted-foreground text-sm">View team details below</p>
				</div>
				{isTeamAdmin || isAdmin ? (
					<Link href={`/dashboard/teams/${params.team}/edit`}>
						<Button className="w-fit">Edit settings</Button>
					</Link>
				) : null}
			</div>
			<Separator />
			<InviteUserToTeamDialog
				visible={isTeamAdmin || isAdmin}
				teamId={teamResponse?.data?.team.id ?? ''}
			/>
			<Suspense fallback={<TeamsMemberTable totalPages={1} isLoading={true} />}>
				<TeamMembersTableContainer teamId={params.team} searchParams={searchParams} />
			</Suspense>

			{isOwner || !isInTeam ? null : (
				<div className="mt-auto">
					<UserLeaveTeamDialog teamId={teamResponse?.data?.team.id ?? ''} />
				</div>
			)}
		</main>
	);
}
