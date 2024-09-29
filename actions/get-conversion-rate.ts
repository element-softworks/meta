'use server';

import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { count, eq } from 'drizzle-orm';

export const getConversionRate = async () => {
	//Get the total number of sessions with emails

	const [convertedCount] = await db
		.select({
			count: count(),
		})
		.from(session)
		.where(eq(session.converted, true));

	const [totalCount] = await db
		.select({
			count: count(),
		})
		.from(session);

	const conversionRate = (convertedCount.count / totalCount.count) * 100;

	return { conversionRate: conversionRate.toFixed(2) };
};
