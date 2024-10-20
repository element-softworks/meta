'use server';

import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { and, count, countDistinct, eq } from 'drizzle-orm';

export const getConversionRate = async () => {
	const [convertedCount] = await db
		.select({
			count: countDistinct(session.ipAddress), // Count distinct IP addresses
		})
		.from(session)
		.where(and(eq(session.converted, true)));

	const [totalCount] = await db
		.select({
			count: countDistinct(session.ipAddress), // Count distinct IP addresses
		})
		.from(session);

	const conversionRate = (convertedCount.count / totalCount.count) * 100;

	return { conversionRate: conversionRate.toFixed(2) };
};
