'use server';

import { db } from '@/db/drizzle/db';
import {
	coach,
	coachApplication,
	coachSchedule,
	timeframe,
	timeframeDay,
} from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { CreateCoachSchema } from '@/schemas/booking-system';
import * as z from 'zod';
/**
 *
 * @returns {Promise<{ success?: string, error?: string }>} A promise that resolves to an object indicating the success
 *  or failure of the operation. If successful, an object containing a success message is returned;
 */

export async function createCoach(values: z.infer<typeof CreateCoachSchema>) {
	console.log('values data', values?.timeframeDays?.find((v) => v.day === 0)?.timeframes);
	const validatedFields = CreateCoachSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'An error occurred creating the coach, please try again later.',
		};
	}

	console.log(
		'validatedFields timeframes',
		validatedFields.data?.timeframeDays?.[0],
		validatedFields.data?.timeframeDays?.[1]
	);

	const user = await currentUser();

	if (!user) {
		return { error: 'User not found' };
	}

	//Create a new coach and trigger a coach application within a transaction
	try {
		await db.transaction(async (trx) => {
			const [intertedCoach] = await trx
				.insert(coach)
				.values({
					userId: user?.id!,
				})
				.returning({ id: coach.id });

			const [createdCoach] = await trx
				.insert(coachApplication)
				.values({
					coachId: intertedCoach?.id!,
				})
				.returning({ id: coachApplication.id });
			// Insert coach schedule record
			const [insertedschedule] = await trx
				.insert(coachSchedule)
				.values({
					coachId: createdCoach.id!,
				})
				.returning({ id: coachSchedule.id });

			// Insert timeframe days for the coach schedule
			const scheduleId = insertedschedule.id;

			// Insert the timeframe days into the timeframeDay table
			const createdTimeframeDays = await trx
				.insert(timeframeDay)
				.values(
					values?.timeframeDays?.map((day) => {
						return {
							coachScheduleId: scheduleId,
							day: day.day,
						};
					})
				)
				.returning({ id: timeframeDay.id, day: timeframeDay.day });

			// Insert timeframes for each timeframe day
			// Flattening timeframes and associating them with the correct timeframeDayId
			const timeframesData = values?.timeframeDays?.flatMap((day, index) =>
				day?.timeframes?.map((timeframe) => ({
					day: createdTimeframeDays[index].day,
					timeframeDayId: createdTimeframeDays[index].id, // Associate with correct day
					startDate: timeframe.startDate,
					endDate: timeframe.endDate,
				}))
			);

			// Insert the timeframes
			await trx.insert(timeframe).values(
				timeframesData?.map((timeframe) => {
					return {
						timeframeDayId: timeframe?.timeframeDayId ?? '',
						startDate: timeframe?.startDate ?? '',
						endDate: timeframe?.endDate ?? '',
					};
				})
			);
		});
	} catch (error) {
		return {
			error: 'An error occurred creating the coach and coach application, please try again later.',
		};
	}

	return { success: 'Coach created successfully' };
}
