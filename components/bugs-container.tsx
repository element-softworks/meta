'use server';

import { getBugs } from '@/actions/get-bugs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currentUser } from '@/lib/auth';
import { BugsInfiniteScroll } from './bugs-infinite-scroll';

export const BugsContainer = async ({ searchParams }: { searchParams: { perPage: string } }) => {
	const user = await currentUser();

	const bugsResponse = await getBugs(parseInt(searchParams?.perPage ?? 10), 1);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Bugs</CardTitle>
				<CardDescription>
					{bugsResponse?.openBugCount?.count ?? 0} bugs remain unresolved
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<BugsInfiniteScroll
					total={bugsResponse?.total?.count}
					bugs={bugsResponse?.bugs}
					user={user}
					perPage={parseInt(searchParams?.perPage ?? 10)}
				/>
			</CardContent>
		</Card>
	);
};
