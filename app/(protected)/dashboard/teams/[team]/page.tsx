import { getTeamById } from '@/actions/get-team';
import { TeamsForm } from '@/components/forms/teams-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default async function DashboardPage({ params }: { params: { team: string } }) {
	const teamResponse = await getTeamById(params.team);
	return (
		<main className="flex flex-col max-w-2xl gap-6">
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
			<div className="flex flex-col gap-2">{/* <TeamsForm /> */}</div>
		</main>
	);
}
