'use server';

import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import stripe from 'stripe';

export async function createPaymentIntent({ amount }: { amount: number }) {
	const stripeData = new stripe(process.env.STRIPE_SECRET_KEY!);

	const user = await currentUser();
	const team = await getTeamById(user?.currentTeam ?? '');

	if (!team) {
		return { error: 'Team not found' };
	}
	if (!user) {
		return { error: 'User not found' };
	}

	try {
		const customer = await stripeData.customers.create({
			email: user?.email ?? '',
			name: team?.team?.name ?? '',
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

		await db.team.update({
			where: { id: team?.team?.id ?? '' },
			data: {
				stripeCustomerId: customer.id ?? '',
				stripePaymentId: paymentIntent.id ?? '',
			},
		});

		return { clientSecret: paymentIntent.client_secret };
	} catch (error) {
		console.error(error);
		return { error: error };
	}
}
