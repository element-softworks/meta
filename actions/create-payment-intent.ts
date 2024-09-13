'use server';

import stripe from 'stripe';

export async function createPaymentIntent(amount: number) {
	const stripeData = new stripe(process.env.STRIPE_SECRET_KEY!);
	try {
		const paymentIntent = await stripeData.paymentIntents.create({
			amount,
			currency: 'gbp',
			automatic_payment_methods: {
				enabled: true,
			},
		});

		console.log(paymentIntent, 'payment intent');

		return { clientSecret: paymentIntent.client_secret };
	} catch (error) {
		console.error(error);
		return { error: error };
	}
}
