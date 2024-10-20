'use server';

import { db } from '@/db/drizzle/db';
import { bug } from '@/db/drizzle/schema';
import { count, desc, eq } from 'drizzle-orm';

export const getBugs = async (perPage: number, pageNum: number) => {
	const bugsResponse = await db
		.select()
		.from(bug)
		.limit(perPage)
		.offset((pageNum - 1) * perPage)
		.orderBy(desc(bug.createdAt));

	const [bugsCount] = await db.select({ count: count() }).from(bug);

	const [openBugCount] = await db
		.select({ count: count() })
		.from(bug)
		.where(eq(bug.status, 'OPEN'));

	const [closedBugCount] = await db
		.select({ count: count() })
		.from(bug)
		.where(eq(bug.status, 'CLOSED'));

	const [inProgressBugCount] = await db
		.select({ count: count() })
		.from(bug)
		.where(eq(bug.status, 'IN_PROGRESS'));

	return {
		bugs: bugsResponse,
		total: bugsCount,
		openBugCount,
		closedBugCount,
		inProgressBugCount,
	};
};
