'use server';

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Stripe secret key not found');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async ({
	userId,
	teamId,
	priceId,
	email,
	stripeCustomerId,
	subscription,
}: {
	userId: string;
	teamId: string;
	priceId: string;
	email: string;
	subscription: boolean;
	stripeCustomerId: string;
}) => {
	if (subscription) {
		//Handle subscription session

		console.log(stripeCustomerId, 'stripeCustomerId');
		try {
			let customer = null;

			if (stripeCustomerId) {
				customer = await stripe.customers.retrieve(stripeCustomerId);
			}

			console.log(customer, 'customer');

			const newCustomer = await stripe.customers.create({
				email: email,
				metadata: {
					userId: userId,
					teamId: teamId,
					email: email,
				},
			});

			if (!customer) {
				customer = newCustomer;
			}

			const session = await stripe.checkout.sessions.create({
				customer: customer.id,
				mode: 'subscription',
				payment_method_types: ['card'],

				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
				allow_promotion_codes: true,
				metadata: {
					userId: userId,
					teamId: teamId,
					email: email,
				},
			});

			return {
				success: true,
				type: 'subscription',
				sessionId: session.id,
			};
		} catch (err) {
			console.error(`Error creating subscription session: ${err}`);
			return {
				error: 'An error occurred while creating the session',
			};
		}
	} else {
		//Handle payment session
		try {
			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				payment_method_types: ['card'],
				metadata: {
					userId,
					teamId,
					email,
				},
				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				customer_email: email,
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/success`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
				allow_promotion_codes: true,
			});

			return {
				success: true,
				type: 'payment',
				sessionId: session.id,
			};
		} catch (err) {
			console.error(`Error creating payment session: ${err}`);
			return {
				error: 'An error occurred while creating the session',
			};
		}
	}
};
