'use server';

import { db } from '@/db/drizzle/db';
import { customer } from '@/db/drizzle/schema';
import { and, between, eq, sql } from 'drizzle-orm';
import plans from '@/plans';

export const getRevenueAnalytics = async () => {
	//we only return subscription customers here for monthly recurring revenue
	const customers = await db
		.select({
			planId: customer.planId,
		})
		.from(customer)
		.where(and(eq(customer.status, 'active'), eq(customer.type, 'subscription')));

	const totalRevenue = customers
		.map((customer) => {
			const currentTeamPlan = Object.entries(plans).find(
				(plan) => plan?.[1]?.stripePricingId === customer?.planId
			)?.[1];

			return currentTeamPlan?.price ?? 0;
		})
		?.reduce((acc, cost) => acc + cost, 0);

	const previousMonthRevenue = await db
		.select({
			planId: customer.planId,
		})
		.from(customer)
		.where(
			and(
				eq(customer.status, 'active'),
				eq(customer.type, 'subscription'),
				between(
					customer.startDate,
					sql`date_trunc('month', CURRENT_DATE - interval '1 month')`,
					sql`date_trunc('month', CURRENT_DATE) - interval '1 day'`
				)
			)
		);

	const previousMonthTotalRevenue = previousMonthRevenue
		.map((customer) => {
			const currentTeamPlan = Object.entries(plans).find(
				(plan) => plan?.[1]?.stripePricingId === customer?.planId
			)?.[1];

			return currentTeamPlan?.price ?? 0;
		})
		?.reduce((acc, cost) => acc + cost, 0);

	const totalRevenueDifference = totalRevenue - previousMonthTotalRevenue;
	const totalRevenueDifferencePercentage =
		(totalRevenueDifference / previousMonthTotalRevenue) * 100;

	const totalCustomersDifference = customers.length - previousMonthRevenue.length;
	const totalCustomersDifferencePercentage =
		(totalCustomersDifference / previousMonthRevenue.length) * 100;

	return {
		totalCustomers: customers.length,
		previousTotalCustomers: previousMonthRevenue.length,
		customersPercentage: totalCustomersDifferencePercentage.toFixed(2) ?? 0,
		revenue: totalRevenue.toFixed(2) ?? 0,
		difference: totalRevenueDifference.toFixed(2) ?? 0,
		percentage: totalRevenueDifferencePercentage.toFixed(2) ?? 0,
	};
};
