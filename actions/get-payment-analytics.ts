import { db } from '@/db/drizzle/db';
import { customer } from '@/db/drizzle/schema';
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
import { and, between, count, eq, sql } from 'drizzle-orm';

export const getSubscriptionAnalytics = async (startDate: string, endDate: string) => {
	const dateDifferenceInDays = differenceInDays(new Date(endDate), new Date(startDate));
	const dateDifferenceInHours = differenceInHours(new Date(endDate), new Date(startDate));

	const adminUser = await currentUser();

	if (adminUser?.role !== 'ADMIN') {
		return { error: 'You are not authorized to view this page' };
	}

	let paymentResponse: { time: string; count: number }[] | undefined = [];

	if (dateDifferenceInHours <= 24) {
		// Group by hour if less than or equal to 24 hours
		paymentResponse = await db
			.select({
				count: count(),
				time: sql<string>`EXTRACT(HOUR FROM ${customer.startDate})`.as('hour'),
			})
			.from(customer)
			.where(
				and(
					between(customer.startDate, new Date(startDate), new Date(endDate)),
					eq(customer.type, 'subscription')
				)
			)
			.groupBy(sql`EXTRACT(HOUR FROM ${customer.startDate})`);

		const hours = Array.from({ length: 24 }, (_, i) => ({ time: i, count: 0 }));

		const formattedSubs = hours.map((hour) => {
			const foundHour = paymentResponse?.find((sub) => Number(sub.time) === hour.time);
			const formattedTime =
				hour.time >= 12 ? `${hour.time - 12 || 12} PM` : `${hour.time} AM`;
			return {
				time: formattedTime,
				count: foundHour?.count ?? 0,
			};
		});

		paymentResponse = formattedSubs;
	} else if (dateDifferenceInDays < 7) {
		// Group by day if more than 24 hours but less than 7 days
		paymentResponse = await db
			.select({
				count: count(),
				time: sql<string>`DATE_TRUNC('day', ${customer.startDate})`.as('day'),
			})
			.from(customer)
			.where(
				and(
					between(customer.startDate, new Date(startDate), new Date(endDate)),
					eq(customer.type, 'subscription')
				)
			)
			.groupBy(sql`DATE_TRUNC('day', ${customer.startDate})`);

		// Generate all days between start and end dates
		const days = [];
		let currentDay = startOfDay(new Date(startDate)); // Start of the first day
		while (currentDay <= new Date(endDate)) {
			days.push({ time: currentDay, count: 0 });
			currentDay = addDays(currentDay, 1); // Increment by a full day
		}

		const formattedSubs = days.map((day) => {
			const foundDay = paymentResponse?.find((sub) => {
				const subDate = new Date(sub.time);
				return format(subDate, 'do MMM') === format(day.time, 'do MMM');
			});

			// Format the day date for display purposes
			const formattedTime = format(day.time, 'do MMM');

			return {
				time: formattedTime,
				count: foundDay?.count ?? 0,
			};
		});

		paymentResponse = formattedSubs;
	} else {
		// Group by week if more than or equal to 7 days
		paymentResponse = await db
			.select({
				count: count(),
				time: sql<string>`DATE_TRUNC('week', ${customer.startDate})`.as('week'),
			})
			.from(customer)
			.where(
				and(
					between(customer.startDate, new Date(startDate), new Date(endDate)),
					eq(customer.type, 'subscription')
				)
			)
			.groupBy(sql`DATE_TRUNC('week', ${customer.startDate})`);

		// Generate all weeks between start and end dates
		const weeks = [];
		let currentWeek = startOfWeek(new Date(startDate)); // Start from the first full week
		while (currentWeek <= new Date(endDate)) {
			weeks.push({ time: currentWeek, count: 0 });
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
			const formattedTime = format(week.time, 'do MMM');

			return {
				time: formattedTime,
				count: foundWeek?.count ?? 0,
			};
		});

		paymentResponse = formattedSubs;
	}

	return {
		analytics: 'payment analytics',
		payments: paymentResponse,
	};
};
