'use server';

import { db } from '@/db/drizzle/db';
import { coach } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';

/**
 * admin only route to get all coaches
 * @param perPage
 * @param pageNum
 * @returns All coaches paginated
 */

export const getAllCoaches = async (perPage: string = '10', pageNum: string = '1') => {
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
		const coaches = await db
			.select()
			.from(coach)
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage));

		const totalCoaches = await db.select().from(coach);

		const totalPages = Math.ceil(totalCoaches.length / Number(perPage));

		return {
			coaches,
			totalPages,
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred getting the coaches, please try again later.',
		};
	}
};
