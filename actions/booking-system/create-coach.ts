// 'use server';

// import { db } from '@/db/drizzle/db';
// import { coach, coachApplication, coachSchedule, timeframeDay } from '@/db/drizzle/schema';
// import { currentUser } from '@/lib/auth';
// import { CreateCoachSchema } from '@/schemas/booking-system';
// import { eq } from 'drizzle-orm';
// import * as z from 'zod';
// /**
//  *
//  * Creates a new coach.
//  * @param {z.infer<typeof CreateCoachSchema>} values - The values containing the coach details.
//  * @param {string} values.timeframeDays - The timeframe days for the coach schedule.
//  * @param {number} values.timeframeDays.day - The day of the week for the timeframe day.
//  * @param {number} values.timeframeDays.startDate - The start time for the timeframe day.
//  * @param {number} values.timeframeDays.endDate - The end time for the timeframe day.
//  * @returns {Promise<{ success?: string, error?: string }>} A promise that resolves to an object indicating the success
//  *  or failure of the operation. If successful, an object containing a success message is returned;
//  */

// export async function createCoach(values: z.infer<typeof CreateCoachSchema>) {
// 	const userData = await currentUser();

// 	if (!userData) {
// 		return { error: 'User not found' };
// 	}

// 	const validatedFields = CreateCoachSchema.safeParse(values);

// 	if (!validatedFields.success) {
// 		return {
// 			error: 'An error occurred creating the coach, please try again later.',
// 		};
// 	}

// 	const user = await currentUser();

// 	if (!user) {
// 		return { error: 'User not found' };
// 	}

// 	const [foundCoach] = await db.select().from(coach).where(eq(coach.userId, user.id!));

// 	if (foundCoach) {
// 		return { error: 'User is already a coach.' };
// 	}

// 	//Create a new coach and trigger a coach application within a transaction
// 	try {
// 		await db.transaction(async (trx) => {
// 			const [intertedCoach] = await trx
// 				.insert(coach)
// 				.values({
// 					userId: user?.id!,

// 				})
// 				.returning({ id: coach.id });

// 			await trx.insert(coachApplication).values({
// 				coachId: intertedCoach?.id!,
// 			});

// 			// Insert coach schedule record
// 			const [insertedschedule] = await trx
// 				.insert(coachSchedule)
// 				.values({
// 					coachId: intertedCoach.id!,
// 				})
// 				.returning({ id: coachSchedule.id, coachId: coachSchedule.coachId });

// 			await trx
// 				.update(coach)
// 				.set({ scheduleId: insertedschedule.id })
// 				.where(eq(coach.id, insertedschedule.coachId));

// 			// Insert timeframe days for the coach schedule
// 			const scheduleId = insertedschedule.id;

// 			// Filter out timeframes within days that overlap with each other
// 			const allowedTimeframes: {
// 				day: number;
// 				startHour: number;
// 				endHour: number;
// 			}[] = [];

// 			values.timeframeDays.forEach((timeframeDay) => {
// 				const { day, startHour, endHour } = timeframeDay;

// 				const existingTimeframe = allowedTimeframes.find(
// 					(allowedTimeframe) => allowedTimeframe.day === day
// 				);

// 				if (!existingTimeframe) {
// 					allowedTimeframes.push(timeframeDay);
// 					return;
// 				}

// 				if (
// 					startHour < existingTimeframe.endHour &&
// 					endHour > existingTimeframe.startHour
// 				) {
// 					existingTimeframe.startHour = Math.min(startHour, existingTimeframe.startHour);
// 					existingTimeframe.endHour = Math.max(startHour, existingTimeframe.endHour);
// 				} else {
// 					allowedTimeframes.push(timeframeDay);
// 				}
// 			});

// 			// Insert the filtered timeframe days into the timeframeDay table
// 			const timeframeDays = allowedTimeframes.map((timeframeDay) => ({
// 				...timeframeDay,
// 				coachScheduleId: scheduleId,
// 			}));

// 			await trx.insert(timeframeDay).values(timeframeDays);
// 		});
// 	} catch (error) {
// 		console.log(error, 'error creating coach');
// 		return {
// 			error: 'An error occurred creating the coach and coach application, please try again later.',
// 		};
// 	}

// 	return { success: 'Coach created successfully' };
// }
