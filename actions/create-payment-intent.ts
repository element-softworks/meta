'use server';

import { getTeamById } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { team } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import stripe from 'stripe';

export async function createPaymentIntent({ amount }: { amount: number }) {
	const stripeData = new stripe(process.env.STRIPE_SECRET_KEY!);

	const user = await currentUser();
	const teamResponse = await getTeamById(user?.currentTeam ?? '');

	if (!teamResponse) {
		return { error: 'Team not found' };
	}
	if (!user) {
		return { error: 'User not found' };
	}

	try {
		const customer = await stripeData.customers.create({
			email: user?.email ?? '',
			name: teamResponse?.data?.team?.name ?? '',
			metadata: {
				userId: user?.id ?? '',
				teamId: user?.currentTeam ?? '',
			},
		});

		const paymentIntent = await stripeData.paymentIntents.create({
			amount: amount,
			customer: customer.id,
			currency: 'gbp',
			automatic_payment_methods: {
				enabled: true,
			},
			description: 'Payment for Nextjs SaaS Boilerplate',
			metadata: {
				userId: user?.id ?? '',
				teamId: user?.currentTeam ?? '',
				email: user?.email ?? '',
				name: user?.name ?? '',
			},
		});

		await db
			.update(team)
			.set({
				stripeCustomerId: customer.id ?? '',
				stripePaymentId: paymentIntent.id ?? '',
			})
			.where(eq(team.id, teamResponse?.data?.team?.id ?? ''));

		return { clientSecret: paymentIntent.client_secret };
	} catch (error) {
		console.error(error);
		return { error: error };
	}
}
