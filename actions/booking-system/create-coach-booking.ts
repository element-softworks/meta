'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachBooking } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { CoachBookingSchema } from '@/schemas/booking-system';
import { addDays, addMinutes, isAfter, isBefore, subMinutes } from 'date-fns';
import { and, eq, not } from 'drizzle-orm';
import * as z from 'zod';

/**
 * Creates a new coach booking.
 * @param {z.infer<typeof CoachBookingSchema>} values - The values containing the coach booking details.
 * @param {string} coachId - The coach id for the booking.
 * @param {Date} values.startDate - The start date for the booking.
 * @param {Date} values.endDate - The end date for the booking.
 * @param {string} values.bookingType - The type of booking.
 * @returns {Promise<{ success?: string, error?: string }>} A promise that resolves to an object indicating the success
 * or failure of the operation. If successful, an object containing a success message is returned;
 * otherwise, an object containing an error message is returned.
 * */

export const createCoachBooking = async (
	values: z.infer<typeof CoachBookingSchema>,
	coachId: string
) => {
	const user = await currentUser();

	if (!user) {
		return {
			error: 'Not authorized',
		};
	}

	const validatedFields = CoachBookingSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'An error occurred creating the coach booking, please try again later.',
		};
	}

	//Get the coach
	const [currentCoach] = await db.select().from(coach).where(eq(coach.id, coachId));

	//Check if the coach exists
	if (!currentCoach) {
		return {
			error: 'Coach not found.',
		};
	}

	//Check if the coach is verified
	if (!currentCoach.verified) {
		return {
			error: 'Coach not verified. Please wait to be verified.',
		};
	}

	//Check if the booking is past the coaches booking in advance limit
	const bookingInAdvance = currentCoach.bookingInAdvance;
	const currentBookingStartDate = new Date(values.startDate);
	const currentBookingEndDate = new Date(values.endDate);
	const currentDate = new Date();

	//Make sure bookings cant be in the past
	if (currentBookingStartDate < currentDate || currentBookingEndDate < currentDate) {
		return {
			error: 'The booking date cannot be in the past.',
		};
	}

	const bookingInAdvanceDate = addDays(currentDate, bookingInAdvance);

	//Make sure the booking is not too far in advance but only if its not a blocked booking
	if (
		values.bookingType !== 'BLOCKED' &&
		(currentBookingStartDate > bookingInAdvanceDate ||
			currentBookingEndDate > bookingInAdvanceDate)
	) {
		return {
			error: `The booking date cannot be more than ${bookingInAdvance} days in advance.`,
		};
	}

	//Check the current bookings and see if the coach is available
	try {
		const currentBookings = await db
			.select()
			.from(coachBooking)
			.where(
				and(
					eq(coachBooking.coachId, coachId),
					not(eq(coachBooking.bookingType, 'CANCELLED'))
				)
			);

		const isAvailable = currentBookings.every((booking) => {
			const bookingStartDate = new Date(booking.startDate);
			const bookingEndDate = new Date(booking.endDate);
			const coachCooldown = currentCoach.cooldown; // cooldown in minutes

			// Add cooldown to both ends: before the start and after the end but only if its not a blocked booking
			const startWithCooldown =
				booking.bookingType !== 'BLOCKED'
					? subMinutes(bookingStartDate, coachCooldown)
					: bookingStartDate;

			const endWithCooldown =
				booking.bookingType !== 'BLOCKED'
					? addMinutes(bookingEndDate, coachCooldown)
					: bookingEndDate;

			// Check if the new booking is outside the cooldown window (both before and after)
			return (
				isBefore(currentBookingEndDate, startWithCooldown) || // Current booking ends before the cooldown buffer before the existing booking
				isAfter(currentBookingStartDate, endWithCooldown) // Current booking starts after the cooldown buffer after the existing booking
			);
		});

		if (!isAvailable) {
			return {
				error: 'The coach is not available for the selected time frame.',
			};
		}
	} catch (error) {
		return {
			error: 'An error occurred checking the coach availability, please try again later.',
		};
	}
	//Create a new coach booking
	try {
		await db.insert(coachBooking).values({
			coachId: coachId,
			startDate: values.startDate,
			endDate: values.endDate,
			bookingType: values.bookingType,
			createdById: user.id,
		});

		return {
			success: `The coach ${
				values.bookingType === 'BOOKING' ? 'booking' : 'blocking'
			} time was successfully created.`,
		};
	} catch (error) {
		return {
			error: 'An error occurred creating the coach booking, please try again later.',
		};
	}
};
