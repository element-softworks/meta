import { BugsContainer } from '@/components/infinite-scrolls/bugs-container';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata() {
	return {
		title: `Bugs | Admin |  Dashboard | Meta`,
		description: 'View and manage bugs for Meta.',
		openGraph: {
			title: `Bugs | Admin |  Dashboard | Meta`,
			description: 'View and manage bugs for Meta.',
		},
		twitter: {
			title: `Bugs | Admin |  Dashboard | Meta`,
			description: 'View and manage bugs for Meta.',
		},
	};
}

export default async function AdminTeamsPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Reported bugs</p>
				<p className="text-muted-foreground text-sm">
					View and manage user reported bugs here
				</p>
			</div>

			<Separator />

			<BugsContainer searchParams={searchParams} />
		</main>
	);
}
