import { ArchiveTeamDialog } from '@/components/dialogs/archive-team-dialog';
import { TeamsForm } from '@/components/forms/teams-form';
import { Separator } from '@/components/ui/separator';
import { getIsUserInTeam, getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { isTeamAuth } from '@/lib/team';
import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: { team: string } }) {
	const teamResponse = await getTeamById(params.team);

	const user = await currentUser();
	const isUserInTeam = await getIsUserInTeam(params.team, user?.id ?? '');

	const isTeamAdmin = isTeamAuth(teamResponse?.team?.members ?? [], user?.id ?? '');

	if (!isUserInTeam || (teamResponse?.team?.isArchived && !isTeamAdmin)) {
		return redirect('/dashboard/teams');
	}

	return (
		<main className="flex flex-col max-w-2xl gap-6 h-full">
			<div className="">
				<p className="text-xl font-bold">
					Edit your team {'"'}
					{teamResponse.team?.name}
					{'"'}
				</p>
				<p className="text-muted-foreground text-sm">
					Change the details below to edit your team
				</p>
			</div>
			<Separator />
			<div className="flex flex-col gap-2">
				<TeamsForm editingTeam={teamResponse.team} editMode />
			</div>

			<div className="mt-auto">
				<ArchiveTeamDialog team={teamResponse?.team} />
			</div>
		</main>
	);
}
