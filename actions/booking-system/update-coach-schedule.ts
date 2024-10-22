'use server';
import { db } from '@/db/drizzle/db';
import { coach, timeframeDay } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { CreateCoachSchema, UpdateCoachScheduleSchema } from '@/schemas/booking-system';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { coachSchedule } from './../../db/drizzle/schema/booking-system/coachSchedule';
/**
 *
 * updates a coach.
 * @param {z.infer<typeof CreateCoachSchema>} values - The values containing the coach details.
 * @param {string} values.timeframeDays - The timeframe days for the coach schedule.
 * @param {number} values.timeframeDays.day - The day of the week for the timeframe day.
 * @param {number} values.timeframeDays.startDate - The start time for the timeframe day.
 * @param {number} values.timeframeDays.endDate - The end time for the timeframe day.
 * @returns {Promise<{ success?: string, error?: string }>} A promise that resolves to an object indicating the success
 *  or failure of the operation. If successful, an object containing a success message is returned;
 */

export async function updateCoachSchedule(
	values: z.infer<typeof UpdateCoachScheduleSchema>,
	coachId: string
) {
	const userData = await currentUser();

	if (!userData) {
		return { error: 'User not found' };
	}

	const validatedFields = UpdateCoachScheduleSchema.safeParse(values);

	//Coach only updates if the user is authentication, the coach is found, the coach is associated with the user, or the user is an admin, and the coach schedule is found
	if (!validatedFields.success) {
		return {
			error: 'An error occurred updating the coach, please try again later.',
		};
	}

	const user = await currentUser();

	if (!user) {
		return { error: 'User not found' };
	}

	const [foundCoach] = await db.select().from(coach).where(eq(coach.id, coachId!));

	if (!foundCoach) {
		return { error: 'No coach found with that ID' };
	}

	if (foundCoach.userId !== user.id && user.role !== 'ADMIN') {
		return { error: 'You are not authorized to update this coach' };
	}

	const [foundCoachSchedule] = await db
		.select()
		.from(coachSchedule)
		.where(eq(coachSchedule.coachId, foundCoach.id));

	if (!foundCoachSchedule) {
		return { error: 'No coach schedule found with that ID' };
	}

	//Delete the existing timeframe days for the coach schedule and insert the new ones, all within a transaction to ensure data integrity
	try {
		await db.transaction(async (trx) => {
			await trx
				.delete(timeframeDay)
				.where(eq(timeframeDay.coachScheduleId, foundCoachSchedule.id!));

			const scheduleId = foundCoachSchedule.id;

			// Filter out timeframes within days that overlap with each other
			const allowedTimeframes: {
				day: number;
				startHour: number;
				endHour: number;
			}[] = [];

			values.timeframeDays.forEach((timeframeDay) => {
				const { day, startHour, endHour } = timeframeDay;

				const existingTimeframe = allowedTimeframes.find(
					(allowedTimeframe) => allowedTimeframe.day === day
				);

				if (!existingTimeframe) {
					allowedTimeframes.push(timeframeDay);
					return;
				}

				if (
					startHour < existingTimeframe.endHour &&
					endHour > existingTimeframe.startHour
				) {
					existingTimeframe.startHour = Math.min(startHour, existingTimeframe.startHour);
					existingTimeframe.endHour = Math.max(startHour, existingTimeframe.endHour);
				} else {
					allowedTimeframes.push(timeframeDay);
				}
			});

			// Insert the filtered timeframe days into the timeframeDay table
			const timeframeDays = allowedTimeframes.map((timeframeDay) => ({
				...timeframeDay,
				coachScheduleId: scheduleId,
			}));

			await trx.insert(timeframeDay).values(timeframeDays);
		});
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred updating the coach schedule, please try again later.',
		};
	}

	return { success: 'Coach schedule updated successfully' };
}
