'use server';

import { getBugs } from '@/actions/get-bugs';
import { currentUser } from '@/lib/auth';
import { BugsInfiniteScroll } from './bugs-infinite-scroll';
import { Card, CardDescription, CardTitle } from './ui/card';

export const BugsContainer = async ({ searchParams }: { searchParams: { perPage: string } }) => {
	const user = await currentUser();

	const bugsResponse = await getBugs(parseInt(searchParams?.perPage ?? 10), 1);

	return (
		<div className="">
			<div className="grid grid-cols-1 sm:grid-cols-3 max-w-2xl gap-2 sm:gap-4">
				<Card className="p-4">
					<CardDescription>Resolved bugs</CardDescription>
					<CardTitle>{bugsResponse?.closedBugCount?.count ?? 0}</CardTitle>
				</Card>

				<Card className="p-4">
					<CardDescription>Open bugs</CardDescription>
					<CardTitle>{bugsResponse?.openBugCount?.count ?? 0}</CardTitle>
				</Card>

				<Card className="p-4">
					<CardDescription>In progress bugs</CardDescription>
					<CardTitle>{bugsResponse?.inProgressBugCount?.count ?? 0}</CardTitle>
				</Card>
			</div>
			<BugsInfiniteScroll
				total={bugsResponse?.total?.count}
				bugs={bugsResponse?.bugs}
				user={user}
				perPage={parseInt(searchParams?.perPage ?? 10)}
			/>
		</div>
	);
};
