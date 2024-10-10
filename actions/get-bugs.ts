'use server';

import { db } from '@/db/drizzle/db';
import { bug } from '@/db/drizzle/schema';
import { count, eq } from 'drizzle-orm';

export const getBugs = async (perPage: number, pageNum: number) => {
	const bugsResponse = await db
		.select()
		.from(bug)
		.limit(perPage)
		.offset((pageNum - 1) * perPage);

	const [bugsCount] = await db.select({ count: count() }).from(bug);

	const [openBugCount] = await db
		.select({ count: count() })
		.from(bug)
		.where(eq(bug.status, 'OPEN'));

	return { bugs: bugsResponse, total: bugsCount, openBugCount };
};
