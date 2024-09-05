import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
	return (
		<main className="flex flex-col max-w-2xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Teams overview</p>
				<p className="text-muted-foreground text-sm">Manage your teams below</p>
			</div>

			<Link href="/dashboard/teams/create">
				<Button className="w-fit">Create a new team</Button>
			</Link>
		</main>
	);
}
