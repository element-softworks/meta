import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import {
	addDays,
	addWeeks,
	differenceInDays,
	differenceInHours,
	endOfWeek,
	format,
	isWithinInterval,
	startOfDay,
	startOfWeek,
} from 'date-fns';
import { between, count, sql } from 'drizzle-orm';

export const getSessionAnalytics = async (startDate: string, endDate: string) => {
	const dateDifferenceInDays = differenceInDays(new Date(endDate), new Date(startDate));
	const dateDifferenceInHours = differenceInHours(new Date(endDate), new Date(startDate));

	const adminUser = await currentUser();

	if (adminUser?.role !== 'ADMIN') {
		return { error: 'You are not authorized to view this page' };
	}

	let paymentResponse: { time: string; desktop: number; mobile: number }[] | undefined = [];

	if (dateDifferenceInHours <= 24) {
		// Group by hour if less than or equal to 24 hours
		paymentResponse = await db
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
			const foundHour = paymentResponse?.find((sub) => Number(sub.time) === hour.time);
			const formattedTime =
				hour.time >= 12 ? `${hour.time - 12 || 12} PM` : `${hour.time} AM`;
			return {
				time: formattedTime,
				mobile: Number(foundHour?.mobile ?? 0),
				desktop: Number(foundHour?.desktop ?? 0),
			};
		});

		paymentResponse = formattedSubs;
	} else if (dateDifferenceInDays < 7) {
		// Group by day if more than 24 hours but less than 7 days
		paymentResponse = await db
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

		console.log(paymentResponse, 'paymentResponse');

		const formattedSubs = days.map((day) => {
			const foundDay = paymentResponse?.find((sub) => {
				const subDate = new Date(sub.time);
				return format(subDate, 'dd/MM/yy') === format(day.time, 'dd/MM/yy');
			});

			// Format the day date for display purposes
			const formattedTime = format(day.time, 'dd/MM/yy');

			return {
				time: formattedTime,
				mobile: Number(foundDay?.mobile ?? 0),
				desktop: Number(foundDay?.desktop ?? 0),
			};
		});

		paymentResponse = formattedSubs;
	} else {
		// Group by week if more than or equal to 7 days
		paymentResponse = await db
			.select({
				desktop:
					sql<number>`SUM(CASE WHEN ${session.deviceType} IS NULL OR ${session.deviceType} = 'desktop' THEN 1 ELSE 0 END)`.as(
						'desktop'
					) ?? '0',
				mobile:
					sql<number>`SUM(CASE WHEN ${session.deviceType} = 'mobile' THEN 1 ELSE 0 END)`.as(
						'mobile'
					) ?? '0',
				time: sql<string>`DATE_TRUNC('week', ${session.createdAt})`.as('week'),
			})
			.from(session)
			.where(between(session.createdAt, new Date(startDate), new Date(endDate)))
			.groupBy(sql`DATE_TRUNC('week', ${session.createdAt})`, session.deviceType);

		// Generate all weeks between start and end dates
		const weeks = [];
		let currentWeek = startOfWeek(new Date(startDate)); // Start from the first full week
		while (currentWeek <= new Date(endDate)) {
			weeks.push({ time: currentWeek, desktop: 0 });
			currentWeek = addWeeks(currentWeek, 1); // Increment by a full week
		}

		const formattedSubs = weeks.map((week) => {
			const foundWeek = paymentResponse?.find((sub) => {
				const subDate = new Date(sub.time);
				return isWithinInterval(subDate, {
					start: startOfWeek(week.time),
					end: endOfWeek(week.time),
				});
			});

			// Format the week start date for display purposes
			const formattedTime = format(week.time, 'dd/MM/yy');

			return {
				time: formattedTime,
				mobile: Number(foundWeek?.mobile ?? 0),
				desktop: Number(foundWeek?.desktop ?? 0),
			};
		});

		paymentResponse = formattedSubs;
	}

	return {
		analytics: 'payment analytics',
		payments: paymentResponse,
	};
};
