'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachBooking } from '@/db/drizzle/schema';
import { CoachBookingSchema } from '@/schemas/booking-system';
import { addDays, addMinutes, isAfter, isBefore, subMinutes } from 'date-fns';
import { eq } from 'drizzle-orm';
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
	const validatedFields = CoachBookingSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'An error occurred creating the coach booking, please try again later.',
		};
	}

	//Get the coach
	const [currentCoach] = await db.select().from(coach).where(eq(coach.id, coachId));

	//Check if the booking is past the coaches booking in advance limit
	const bookingInAdvance = currentCoach.bookingInAdvance;
	const currentBookingStartDate = new Date(values.startDate);
	const currentBookingEndDate = new Date(values.endDate);
	const currentDate = new Date();

	//Make sure bookings cant be in the past
	if (currentBookingStartDate < currentDate || currentBookingEndDate < currentDate) {
		console.log('The booking date cannot be in the past.');
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
		console.log(`The booking date cannot be more than ${bookingInAdvance} days in advance.`);
		return {
			error: `The booking date cannot be more than ${bookingInAdvance} days in advance.`,
		};
	}

	//Check the current bookings and see if the coach is available
	try {
		const currentBookings = await db
			.select()
			.from(coachBooking)
			.where(eq(coachBooking.coachId, coachId));

		const isAvailable = currentBookings.every((booking) => {
			const bookingStartDate = new Date(booking.startDate);
			const bookingEndDate = new Date(booking.endDate);
			const coachCooldown = currentCoach.cooldown; // cooldown in minutes

			// Add cooldown to both ends: before the start and after the end
			const startWithCooldown = subMinutes(bookingStartDate, coachCooldown);
			const endWithCooldown = addMinutes(bookingEndDate, coachCooldown);

			// Check if the new booking is outside the cooldown window (both before and after)
			return (
				isBefore(currentBookingEndDate, startWithCooldown) || // Current booking ends before the cooldown buffer before the existing booking
				isAfter(currentBookingStartDate, endWithCooldown) // Current booking starts after the cooldown buffer after the existing booking
			);
		});

		if (!isAvailable) {
			console.log('The coach is not available for the selected time frame.');
			return {
				error: 'The coach is not available for the selected time frame.',
			};
		}
	} catch (error) {
		console.log('An error occurred checking the coach availability, please try again later.');
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
		});

		return {
			success: 'Coach booking created successfully',
		};
	} catch (error) {
		return {
			error: 'An error occurred creating the coach booking, please try again later.',
		};
	}
};
