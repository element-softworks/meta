'use server';

import { getCookie } from '@/data/cookies';
import { isTeamOwnerServer } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { customer, session } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
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
		//If you are a team admin, or a site admin, you can archive/restore a team
		const isOwner = await isTeamOwnerServer(teamId, userId);

		if (!isOwner) {
			return { error: 'You must be the team owner to manage billing' };
		}

		try {
			let customer = null;

			const sessionResponse = await getCookie('session');

			console.log('Session response', sessionResponse?.value);

			//If we have a stripeCustomerId, we are to retrieve the customer
			if (!!stripeCustomerId?.length) {
				try {
					await handleUpgradeSubscription(stripeCustomerId, priceId);
					return { success: 'Subscription updated', updated: true };
				} catch (err) {
					console.error(`Error updating subscription: ${err}`);

					return {
						error: 'An error occurred while updating the subscription',
					};
				}
			} else {
				const newCustomer = await stripe.customers.create({
					email: email,
					metadata: {
						userId: userId,
						teamId: teamId,
						email: email,
						userSession: sessionResponse?.value ?? '',
					},
				});
				customer = newCustomer;
			}

			const checkoutSession = await stripe.checkout.sessions.create({
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
					userSession: sessionResponse?.value ?? '',
				},
			});

			return {
				success: true,
				type: 'subscription',
				sessionId: checkoutSession.id,
			};
		} catch (err) {
			console.error(`Error creating subscription session: ${err}`);
			return {
				error: 'An error occurred while creating the session',
			};
		}
	} else {
		//Handle payment session
		//TODO: CREATE ONE TIME PAYMENTS HERE
		const sessionResponse = await getCookie('session');

		try {
			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				payment_method_types: ['card'],
				metadata: {
					userId,
					teamId,
					email,
					userSession: sessionResponse?.value ?? '',
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

const handleUpgradeSubscription = async (stripeCustomerId: string, priceId: string) => {
	//If we have a stripeCustomerId, we are trying to upgrade / downgrade the subscription

	if (stripeCustomerId) {
		const customerResponse = await db.query.customer.findFirst({
			where: eq(customer.stripeCustomerId, stripeCustomerId),
		});

		if (!customerResponse) {
			return {
				error: 'Customer not found',
			};
		}

		const subscriptionItems = await stripe.subscriptionItems.list({
			subscription: customerResponse?.stripeSubscriptionId ?? '',
		});

		if (!subscriptionItems?.data[0]?.id) {
			return {
				error: 'Subscription not found',
			};
		}

		const subscription = await stripe.subscriptions.update(
			customerResponse?.stripeSubscriptionId ?? '',
			{
				proration_behavior: 'always_invoice',
				items: [
					{
						id: subscriptionItems?.data[0].id,
						price: priceId,
					},
				],
			}
		);

		if (!subscription) {
			return {
				error: 'Failed to update subscription',
			};
		}

		await db
			.update(customer)
			.set({
				stripeSubscriptionId: subscription.id,
			})
			.where(eq(customer.stripeCustomerId, stripeCustomerId));

		return {
			success: 'Subscription updated',
		};
	}
};
