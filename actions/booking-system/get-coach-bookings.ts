'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachBooking } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, count, desc, eq, not } from 'drizzle-orm';

export const getCoachBookings = async (
	coachId: string,
	perPage: number,
	pageNum: number,
	cancelled?: boolean
) => {
	const user = await currentUser();

	if (!user) {
		return {
			error: 'Not authorized',
		};
	}

	const [foundCoach] = await db.select().from(coach).where(eq(coach.id, coachId));

	if (!foundCoach) {
		return {
			error: 'No coach found with that ID',
		};
	}

	try {
		const foundBookings = await db
			.select()
			.from(coachBooking)
			.where(
				and(
					eq(coachBooking.coachId, coachId),
					cancelled ? undefined : not(eq(coachBooking.bookingType, 'CANCELLED'))
				)
			)
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage))
			.orderBy(desc(coachBooking.startDate));

		const [totalBookings] = await db
			.select({ count: count() })
			.from(coachBooking)
			.where(
				and(
					eq(coachBooking.coachId, coachId),
					cancelled ? undefined : not(eq(coachBooking.bookingType, 'CANCELLED'))
				)
			);

		const totalPages = Math.ceil(totalBookings.count / perPage);

		return {
			success: true,
			bookings: foundBookings,
			totalPages: totalPages,
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred getting the bookings, please try again later.',
		};
	}
};
