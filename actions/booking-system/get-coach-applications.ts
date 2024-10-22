'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachApplication } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { count, desc, eq } from 'drizzle-orm';

/**
 * admin only route to get all coaches
 * @param perPage
 * @param pageNum
 * @param status - optional status filter, if not provided all coach applications will be returned, (PENDING, APPROVED, REJECTED)
 * @returns All coach applications paginated with coach details
 */

export const getCoachApplications = async (
	perPage: string = '10',
	pageNum: string = '1',
	status?: 'PENDING' | 'APPROVED' | 'REJECTED'
) => {
	const user = await currentUser();

	if (!user) {
		return {
			error: 'Not authorized',
		};
	}

	if (user.role !== 'ADMIN') {
		return {
			error: 'Not authorized',
		};
	}

	try {
		const foundCoachApplications = await db
			.select({
				coachApplication: coachApplication,
				coach: coach,
			})
			.from(coachApplication)
			.where(status ? eq(coachApplication.status, status) : undefined)
			.leftJoin(coach, eq(coach.id, coachApplication.coachId))
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage))
			.orderBy(desc(coachApplication.createdAt));

		const [totalCoachApplications] = await db
			.select({ count: count() })
			.from(coachApplication)
			.where(status ? eq(coachApplication.status, status) : undefined);

		const totalPages = Math.ceil(totalCoachApplications.count / Number(perPage));

		return {
			foundCoachApplications,
			totalPages,
		};
	} catch (error) {
		console.error(error, 'error getting coach applications');
		return {
			error: 'An error occurred getting the coach applications, please try again later.',
		};
	}
};
