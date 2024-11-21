'use server';

import { db } from '@/db/drizzle/db';
import { coach, coachSchedule, timeframeDay, user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

/**
 *
 * @param coachId
 * @returns coach, coachSchedule, the user associated with the coach, and the coach schedule with timeframe days
 */

export const getScheduleByCoach = async (coachId: string) => {
	const foundUser = await currentUser();

	if (!foundUser) {
		return { error: 'Not authorized' };
	}
	try {
		// Fetch the coach and user
		const [foundCoach] = await db
			.select({ user: user, coach: coach })
			.from(coach)
			.where(eq(coach.id, coachId!))
			.leftJoin(user, eq(user.id, coach.userId));

		if (!foundCoach) {
			return { error: 'No coach found with that ID' };
		}

		// Fetch the coach schedule and left join with timeframeDay
		const coachScheduleWithTimeframes = await db
			.select({
				coachSchedule: coachSchedule,
				timeframeDay: timeframeDay,
			})
			.from(coachSchedule)
			.where(eq(coachSchedule.coachId, foundCoach.coach.id))
			.leftJoin(timeframeDay, eq(timeframeDay.coachScheduleId, coachSchedule.id));

		if (!coachScheduleWithTimeframes.length) {
			return { error: 'No coach schedule found' };
		}

		return {
			schedule: coachScheduleWithTimeframes.map((record) => ({
				timeframeDay: record.timeframeDay,
			})),
			coachSchedule: coachScheduleWithTimeframes?.[0]?.coachSchedule,
			coach: foundCoach.coach,
			user: foundCoach.user,
		};
	} catch (error) {
		console.log(error, 'error getting coach schedule');
		return { error: 'An error occurred getting the coach schedule, please try again later.' };
	}
};
