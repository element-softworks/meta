'use server';

import { getCookie } from '@/data/cookies';
import { getTeamById, isTeamOwnerServer } from '@/data/team';
import { db } from '@/db/drizzle/db';
import { customer as DbCustomer } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
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
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	const sessionResponse = await getCookie('session');
	const team = await getTeamById(teamId);

	if (!team?.data?.team) {
		return {
			error: 'Team not found',
		};
	}
	if (team?.data?.team?.isArchived) {
		return {
			error: 'Team is archived, please restore the team to manage billing',
		};
	}

	let customer = null;

	if (subscription) {
		//If you are a team admin, or a site admin, you can archive/restore a team

		//If we have a stripeCustomerId, we are to retrieve the customer
		if (!!stripeCustomerId?.length) {
			try {
				await handleUpgradeSubscription(
					stripeCustomerId,
					priceId,
					sessionResponse?.value ?? ''
				);
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
					priceId: priceId,
				},
			});
			customer = newCustomer;
		}
		const isOwner = await isTeamOwnerServer(teamId, userId);

		if (!isOwner) {
			return { error: 'You must be the team owner to manage billing' };
		}

		try {
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

		const sessionResponse = await getCookie('session');
		let discount = null;
		//If we have a stripeCustomerId, we are to retrieve the customer
		if (!!stripeCustomerId?.length) {
			const customerResponse = await db.query.customer.findFirst({
				where: eq(DbCustomer.stripeCustomerId, stripeCustomerId),
			});

			try {
				const response = await handleUpgradeOneTimePayment(
					stripeCustomerId,
					priceId,
					customerResponse?.planId ?? '',
					sessionResponse?.value ?? ''
				);
				discount = response?.discount;
				customer = response?.customer;
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
					priceId: priceId,
				},
			});
			customer = newCustomer;
		}

		try {
			const session = await stripe.checkout.sessions.create({
				mode: 'payment',

				invoice_creation: {
					enabled: true,
				},
				discounts: !!discount?.id
					? [
							{
								coupon: discount?.id,
							},
						]
					: [],
				customer: customer?.id ?? '',
				payment_method_types: ['card'],
				metadata: {
					userId,
					teamId,
					email,
					userSession: sessionResponse?.value ?? '',
					priceId,
				},
				line_items: [
					{
						price: priceId,
						quantity: 1,
					},
				],
				success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing/success`,
				cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${teamId}/billing`,
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

const handleUpgradeSubscription = async (
	stripeCustomerId: string,
	priceId: string,
	userSession: string
) => {
	//If we have a stripeCustomerId, we are trying to upgrade / downgrade the subscription

	if (!!stripeCustomerId) {
		const customerResponse = await db.query.customer.findFirst({
			where: eq(DbCustomer.stripeCustomerId, stripeCustomerId),
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

		await stripe.customers.update(stripeCustomerId, {
			metadata: {
				userId: customerResponse?.userId,
				teamId: customerResponse?.teamId,
				email: customerResponse?.email,
				userSession: userSession ?? '',
			},
		});

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
			.update(DbCustomer)
			.set({
				stripeSubscriptionId: subscription.id,
			})
			.where(eq(DbCustomer.stripeCustomerId, stripeCustomerId));

		return {
			success: 'Subscription updated',
		};
	}
};

const handleUpgradeOneTimePayment = async (
	stripeCustomerId: string,
	priceId: string,
	existingPriceId: string,
	userSession: string
) => {
	if (!!stripeCustomerId) {
		const customerResponse = await db.query.customer.findFirst({
			where: eq(DbCustomer.stripeCustomerId, stripeCustomerId),
		});

		if (!customerResponse) {
			return {
				error: 'Customer not found',
			};
		}

		const foundPrice = await stripe.prices.retrieve(existingPriceId);

		const coupon = await stripe.coupons.create({
			amount_off: foundPrice?.unit_amount ?? 0,
			currency: foundPrice?.currency,
			duration: 'once',
		});

		const updatedCustomer = await stripe.customers.update(stripeCustomerId, {
			metadata: {
				userId: customerResponse?.userId,
				teamId: customerResponse?.teamId,
				email: customerResponse?.email,
				userSession: userSession ?? '',
				priceId: priceId,
			},
		});

		return {
			success: 'Customer updated',
			customer: updatedCustomer,
			discount: coupon,
		};
	}
};
