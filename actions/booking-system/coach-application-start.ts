'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';

export const coachApplicationStart = async () => {
	const [newCoachApplication] = await db
		.insert(coachApplication)
		.values({ status: 'IN_PROGRESS' })
		.returning({ id: coachApplication.id });

	return { success: true, data: newCoachApplication };
};
