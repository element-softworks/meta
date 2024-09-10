import { TeamsForm } from '@/components/forms/teams-form';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';

export default async function DashboardPage({ params }: { params: { team: string } }) {
	const teamResponse = await getTeamById(params.team);

	return (
		<main className="flex flex-col max-w-2xl gap-6">
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
		</main>
	);
}
