'use server';

import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { and, between, sql } from 'drizzle-orm';

export const getUniqueSessionsCount = async (startDate: string, endDate: string) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	if (authUser?.role !== 'ADMIN') {
		return { error: 'Not authorized' };
	}

	const [sessionsResponse] = await db
		.select({ unique: sql<string>`COUNT(DISTINCT ${session.ipAddress})` })
		.from(session)
		.where(and(between(session.createdAt, new Date(startDate), new Date(endDate))));

	const differenceInMs = differenceInMilliseconds(new Date(endDate), new Date(startDate));
	const [previousSessionsResponse] = await db
		.select({ unique: sql<string>`COUNT(DISTINCT ${session.ipAddress})` })
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

	const percentageDifference = previousSessionsResponse.unique
		? (
				((Number(sessionsResponse.unique) - Number(previousSessionsResponse.unique)) /
					Number(previousSessionsResponse.unique)) *
				100
			).toFixed(2)
		: 0;

	return {
		sessions: sessionsResponse,
		percentageDifference: percentageDifference === 'Infinity' ? 0 : percentageDifference,
	};
};
