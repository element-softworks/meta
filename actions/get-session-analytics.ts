import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { addDays, differenceInHours, format, startOfDay } from 'date-fns';
import { between, sql } from 'drizzle-orm';
import { unique } from 'drizzle-orm/pg-core';

export const getSessionAnalytics = async (startDate: string, endDate: string) => {
	const dateDifferenceInHours = differenceInHours(new Date(endDate), new Date(startDate));

	const adminUser = await currentUser();

	if (adminUser?.role !== 'ADMIN') {
		return { error: 'You are not authorized to view this page' };
	}

	let sessionResponse: { time: string; desktop: number; mobile: number }[] | undefined = [];

	if (dateDifferenceInHours <= 24) {
		// Group by hour if less than or equal to 24 hours

		sessionResponse = await db
			.select({
				desktop:
					sql<number>`SUM(CASE WHEN ${session.deviceType} IS NULL OR ${session.deviceType} = 'desktop' THEN 1 ELSE 0 END)`.as(
						'desktop'
					) ?? '0',
				mobile:
					sql<number>`SUM(CASE WHEN ${session.deviceType} = 'mobile' THEN 1 ELSE 0 END)`.as(
						'mobile'
					) ?? '0',
				time: sql<string>`EXTRACT(HOUR FROM ${session.createdAt})`.as('hour'),
			})
			.from(session)
			.where(between(session.createdAt, new Date(startDate), new Date(endDate)))
			.groupBy(sql`EXTRACT(HOUR FROM ${session.createdAt})`);

		const hours = Array.from({ length: 24 }, (_, i) => ({ time: i, desktop: 0 }));

		const formattedSubs = hours.map((hour) => {
			const foundHour = sessionResponse?.find((sub) => Number(sub.time) === hour.time);
			const formattedTime =
				hour.time >= 12 ? `${hour.time - 12 || 12} PM` : `${hour.time} AM`;
			return {
				time: formattedTime,
				mobile: Number(foundHour?.mobile ?? 0),
				desktop: Number(foundHour?.desktop ?? 0),
			};
		});

		sessionResponse = formattedSubs;
	} else {
		// Group by day if more than 24 hours but less than 7 days
		sessionResponse = await db
			.select({
				desktop:
					sql<number>`SUM(CASE WHEN ${session.deviceType} IS NULL OR ${session.deviceType} = 'desktop' THEN 1 ELSE 0 END)`.as(
						'desktop'
					) ?? '0',
				mobile:
					sql<number>`SUM(CASE WHEN ${session.deviceType} = 'mobile' THEN 1 ELSE 0 END)`.as(
						'mobile'
					) ?? '0',
				time: sql<string>`DATE_TRUNC('day', ${session.createdAt})`.as('day'),
			})
			.from(session)
			.where(between(session.createdAt, new Date(startDate), new Date(endDate)))
			.groupBy(sql`DATE_TRUNC('day', ${session.createdAt})`);

		// Generate all days between start and end dates
		const days = [];
		let currentDay = startOfDay(new Date(startDate)); // Start of the first day
		while (currentDay <= new Date(endDate)) {
			days.push({ time: currentDay, desktop: 0 });
			currentDay = addDays(currentDay, 1); // Increment by a full day
		}

		const formattedSubs = days.map((day) => {
			const foundDay = sessionResponse?.find((sub) => {
				const subDate = new Date(sub.time);
				return (
					format(subDate, `do MMM ${dateDifferenceInHours >= 8760 ? 'yy' : ''}`) ===
					format(day.time, `do MMM ${dateDifferenceInHours >= 8760 ? 'yy' : ''}`)
				);
			});

			// Format the day date for display purposes
			const formattedTime = format(
				day.time,
				`do MMM ${dateDifferenceInHours >= 8760 ? 'yy' : ''}`
			);

			return {
				time: formattedTime,
				mobile: Number(foundDay?.mobile ?? 0),
				desktop: Number(foundDay?.desktop ?? 0),
			};
		});

		sessionResponse = formattedSubs;
	}

	return {
		analytics: 'payment analytics',
		payments: sessionResponse,
	};
};
