'use server';

import { db } from '@/db/drizzle/db';
import { coachBooking } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

/**
 *
 * @param bookingId - the id of the booking to cancel
 * @returns success or error message
 */
export const cancelCoachBooking = async (bookingId: string) => {
	const user = await currentUser();

	if (!user) {
		return {
			error: 'Not authorized',
		};
	}

	try {
		const [foundBooking] = await db
			.select()
			.from(coachBooking)
			.where(eq(coachBooking.id, bookingId));

		if (!foundBooking) {
			return {
				error: 'Booking not found',
			};
		}

		if (foundBooking.createdById !== user.id && user.role !== 'ADMIN') {
			return {
				error: 'Not authorized',
			};
		}

		try {
			await db
				.update(coachBooking)
				.set({
					bookingType: 'CANCELLED',
				})
				.where(eq(coachBooking.id, bookingId));

			return {
				success: 'Booking cancelled successfully',
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'An error occurred cancelling the booking, please try again later.',
			};
		}
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred finding the booking, please try again later.',
		};
	}
};
