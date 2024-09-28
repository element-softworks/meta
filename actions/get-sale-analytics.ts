import { db } from '@/db/drizzle/db';
import { customerInvoice } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { addDays, differenceInHours, format, startOfDay } from 'date-fns';
import { between, sql } from 'drizzle-orm';

export const getSaleAnalytics = async (startDate: string, endDate: string) => {
	const dateDifferenceInHours = differenceInHours(new Date(endDate), new Date(startDate));

	const adminUser = await currentUser();

	if (adminUser?.role !== 'ADMIN') {
		return { error: 'You are not authorized to view this page' };
	}

	let customerInvoiceResponse: { time: string; amount: number }[] | undefined = [];

	if (dateDifferenceInHours <= 24) {
		// Group by hour if less than or equal to 24 hours
		customerInvoiceResponse = await db
			.select({
				amount: sql<number>`sum(${customerInvoice.amountPaid})`,
				time: sql<string>`EXTRACT(HOUR FROM ${customerInvoice.createdAt})`.as('hour'),
			})
			.from(customerInvoice)
			.where(between(customerInvoice.createdAt, new Date(startDate), new Date(endDate)))
			.groupBy(sql`EXTRACT(HOUR FROM ${customerInvoice.createdAt})`);

		const hours = Array.from({ length: 24 }, (_, i) => ({ time: i, desktop: 0 }));

		const formattedSubs = hours.map((hour) => {
			const foundHour = customerInvoiceResponse?.find(
				(sub) => Number(sub.time) === hour.time
			);
			const formattedTime =
				hour.time >= 12 ? `${hour.time - 12 || 12} PM` : `${hour.time} AM`;
			return {
				time: formattedTime,
				amount: Number(foundHour?.amount ?? 0) / 100,
			};
		});

		customerInvoiceResponse = formattedSubs;
	} else {
		// Group by day if more than 24 hours but less than 7 days
		customerInvoiceResponse = await db
			.select({
				amount: sql<number>`sum(${customerInvoice.amountPaid})`,
				time: sql<string>`DATE_TRUNC('day', ${customerInvoice.createdAt})`.as('day'),
			})
			.from(customerInvoice)
			.where(between(customerInvoice.createdAt, new Date(startDate), new Date(endDate)))
			.groupBy(sql`DATE_TRUNC('day', ${customerInvoice.createdAt})`);

		// Generate all days between start and end dates
		const days = [];
		let currentDay = startOfDay(new Date(startDate)); // Start of the first day
		while (currentDay <= new Date(endDate)) {
			days.push({ time: currentDay, desktop: 0 });
			currentDay = addDays(currentDay, 1); // Increment by a full day
		}

		const formattedSubs = days.map((day) => {
			const foundDay = customerInvoiceResponse?.find((sub) => {
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
				amount: Number(foundDay?.amount ?? 0) / 100,
			};
		});

		customerInvoiceResponse = formattedSubs;
	}

	console.log(customerInvoiceResponse, 'reponse data');

	return {
		analytics: 'payment analytics',
		payments: customerInvoiceResponse,
	};
};
