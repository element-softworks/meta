import { getUsersTeams } from '@/actions/get-users-teams';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function DashboardPage() {
	const user = await currentUser();
	const teamsResponse = await getUsersTeams(user?.id ?? '');
	return (
		<main className="flex flex-col max-w-2xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Teams overview</p>
				<p className="text-muted-foreground text-sm">Manage your teams below</p>
			</div>

			<Link href="/dashboard/teams/create">
				<Button className="w-fit">Create a new team</Button>
			</Link>

			{teamsResponse?.teams?.map?.((team) => {
				console.log(team, 'team data');
				return (
					<div
						key={team.teamId}
						className="flex items-center justify-between p-4 bg-white rounded-md shadow-sm"
					>
						{team?.team?.image ? (
							<img width={50} height={50} src={team.team.image} />
						) : null}
						<div>
							<p className="text-lg font-bold">{team.team?.name}</p>
						</div>
						<Link href={`/dashboard/teams/${team.teamId}`}>
							<Button>View</Button>
						</Link>
					</div>
				);
			})}
		</main>
	);
}
