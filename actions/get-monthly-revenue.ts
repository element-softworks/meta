'use server';

import { db } from '@/db/drizzle/db';
import { customer } from '@/db/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import plans from '@/plans.json';

export const getMonthlyRevenue = async () => {
	const customers = await db
		.select({
			planId: customer.planId,
		})
		.from(customer)
		.where(eq(customer.status, 'active'))
		.groupBy(customer.planId);

	const totalRevenue = customers
		.map((customer) => {
			const currentTeamPlan = Object.entries(plans).find(
				(plan) => plan?.[1]?.stripePricingId === customer?.planId
			)?.[1];

			return currentTeamPlan?.price ?? 0;
		})
		?.reduce((acc, cost) => acc + cost, 0);
	return {
		revenue: totalRevenue.toFixed(2) ?? 0,
	};
};
