'use server';

import { db } from '@/db/drizzle/db';
import { customerInvoice } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { and, between, eq, sql } from 'drizzle-orm';

export const getTotalSales = async (startDate: string, endDate: string) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	if (authUser?.role !== 'ADMIN') {
		return { error: 'Not authorized' };
	}
	//we only return subscription customers here for monthly recurring revenue

	const differenceInMs = differenceInMilliseconds(new Date(endDate), new Date(startDate));

	const [invoicesResponse] = await db
		.select({
			total: sql<number>`sum(${customerInvoice.amountPaid})`,
		})
		.from(customerInvoice)
		.where(
			and(
				eq(customerInvoice.status, 'succeeded'),
				between(customerInvoice.createdAt, new Date(startDate), new Date(endDate))
			)
		);

	const [invoicesDifferenceResponse] = await db
		.select({
			total: sql<number>`sum(${customerInvoice.amountPaid})`,
		})
		.from(customerInvoice)
		.where(
			and(
				eq(customerInvoice.status, 'succeeded'),
				between(
					customerInvoice.createdAt,
					addMilliseconds(new Date(startDate), -differenceInMs),
					new Date(startDate)
				)
			)
		);

	const salesDifference = invoicesResponse?.total - invoicesDifferenceResponse?.total;
	const salesDifferencePercentage = (
		(salesDifference / invoicesDifferenceResponse?.total) *
		100
	).toFixed(2);

	return {
		sales: ((invoicesResponse?.total ?? 0) / 100).toFixed(2),
		salesDifference: ((salesDifference ?? 0) / 100).toFixed(2),
		salesDifferencePercentage:
			salesDifferencePercentage === 'Infinity' ? 0 : salesDifferencePercentage,
	};
};
