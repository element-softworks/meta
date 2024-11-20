'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachApplication } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

/**
 * admin only route to get all coaches
 * @param perPage
 * @param pageNum
 * @param status - optional status filter, if not provided all coach applications will be returned, (PENDING, APPROVED, REJECTED)
 * @returns All coach applications paginated with coach details
 */

export const getCoachApplication = async (appId: string) => {
	const user = await currentUser();

	if (!user) {
		return {
			error: 'Not authorized',
		};
	}

	const [userCoach] = await db
		.select()
		.from(coach)
		.where(eq(coach.userId, user?.id ?? ''));

	const [userCoachApplication] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.coachId, userCoach?.id ?? ''));

	if (!userCoachApplication) {
		if (user.role !== 'ADMIN') {
			return {
				error: 'Not authorized',
			};
		}
	}

	try {
		const [foundApplication] = await db
			.select()
			.from(coachApplication)
			.where(eq(coachApplication.id, appId));
		return {
			coachApplication: foundApplication,
		};
	} catch (error) {
		console.error(error, 'error getting coach applications');
		return {
			error: 'An error occurred getting the coach applications, please try again later.',
		};
	}
};
