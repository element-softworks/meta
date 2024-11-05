'use server';

import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
	throw new Error('Stripe secret key not found');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const cancelSubscription = async (customerId: string, userId: string) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	if (!customerId) {
		return { error: 'Customer ID is required' };
	}

	if (!userId) {
		return { error: 'User ID is required' };
	}

	const user = await getUserById(userId);

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

		revalidatePath(`/dashboard/users/${user}/billing`);
		return { success: 'Subscription cancelled' };
	} catch (error: any) {
		console.error('An error occurred cancelling your subscription:' + error);
		return { error: 'An error occurred cancelling your subscription' };
	}
};
