'use server';

import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Stripe secret key not found');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const cancelSubscription = async (customerId: string, teamId: string, userId: string) => {
	if (!customerId) {
		return { error: 'Customer ID is required' };
	}

	if (!teamId) {
		return { error: 'Team ID is required' };
	}

	if (!userId) {
		return { error: 'User ID is required' };
	}

	try {
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
		});

		await Promise.all(
			subscriptions.data.map(async (subscription) => {
				await stripe.subscriptions.update(subscription.id, {
					cancel_at_period_end: true,
				});
			})
		);

		revalidatePath(`/dashboard/teams/${teamId}/billing`);
		return { success: 'Subscription cancelled' };
	} catch (error: any) {
		console.error('An error occurred cancelling your subscription:' + error);
		return { error: 'An error occurred cancelling your subscription' };
	}
};
