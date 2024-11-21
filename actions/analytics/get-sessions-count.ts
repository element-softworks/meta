'use server';

import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { and, between, count, eq, gte, lte, sql } from 'drizzle-orm';

export const getSessionsCount = async (startDate: string, endDate: string, active: boolean) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	if (authUser?.role !== 'ADMIN') {
		return { error: 'Not authorized' };
	}
	const [sessionsResponse] = await db
		.select({ count: count() })
		.from(session)
		.where(
			and(
				between(session.createdAt, new Date(startDate), new Date(endDate)),
				active
					? and(gte(session.endsAt, new Date()), lte(session.createdAt, new Date()))
					: undefined
			)
		);

	const differenceInMs = differenceInMilliseconds(new Date(endDate), new Date(startDate));
	const [previousSessionsResponse] = await db
		.select({ count: count() })
		.from(session)
		.where(
			and(
				between(
					session.createdAt,
					addMilliseconds(new Date(startDate), -differenceInMs),
					new Date(startDate)
				)
			)
		);

	const percentageDifference = active
		? null
		: previousSessionsResponse.count
			? (
					((sessionsResponse.count - previousSessionsResponse.count) /
						previousSessionsResponse.count) *
					100
				).toFixed(2)
			: 0;

	return { sessions: sessionsResponse, percentageDifference };
};
