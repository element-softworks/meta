'use server';

import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import stripe from 'stripe';

export async function createPaymentIntent({ amount }: { amount: number }) {
	const stripeData = new stripe(process.env.STRIPE_SECRET_KEY!);

	const foundUser = await currentUser();

	if (!foundUser) {
		return { error: 'User not found' };
	}

	try {
		const customer = await stripeData.customers.create({
			email: foundUser?.email ?? '',
			name: foundUser?.name ?? '',
			metadata: {
				userId: foundUser?.id ?? '',
			},
		});

		const paymentIntent = await stripeData.paymentIntents.create({
			amount: amount,
			customer: customer.id,
			currency: 'gbp',
			automatic_payment_methods: {
				enabled: true,
			},
			description: 'Payment for Meta',
			metadata: {
				userId: foundUser?.id ?? '',
				email: foundUser?.email ?? '',
				name: foundUser?.name ?? '',
			},
		});

		await db
			.update(user)
			.set({
				stripeCustomerId: customer.id ?? '',
				stripePaymentId: paymentIntent.id ?? '',
			})
			.where(eq(user.id, foundUser?.id ?? ''));

		return { clientSecret: paymentIntent.client_secret };
	} catch (error) {
		console.error(error);
		return { error: error };
	}
}
