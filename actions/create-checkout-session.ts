'use server';

import { getTeamById } from '@/data/team';
import { getUserById } from '@/data/user';
import { isTeamOwner } from '@/lib/team';
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

		const team = await getTeamById(teamId);

		if (!team) {
			return {
				error: 'Team not found',
			};
		}

		const user = await getUserById(userId);

		if (!user) {
			return {
				error: 'User not found',
			};
		}

		const isOwner = await isTeamOwner(team.team?.members ?? [], userId);

		if (!isOwner) {
			return {
				error: 'You must be the team owner to manage billing',
			};
		}

		try {
			let customer = null;

			//If we have a stripeCustomerId, retrieve the customer, otherwise create a new customer
			if (stripeCustomerId) {
				customer = await stripe.customers.retrieve(stripeCustomerId);
			} else {
				const newCustomer = await stripe.customers.create({
					email: email,
					metadata: {
						userId: userId,
						teamId: teamId,
						email: email,
					},
				});

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
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing/success`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing`,
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
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing/success`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing`,
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
