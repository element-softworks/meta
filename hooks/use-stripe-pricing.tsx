'use client';

import { createCheckoutSession } from '@/actions/create-checkout-session';
import { Toast } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';
import plans from '@/plans.json';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { useCurrentUser } from './use-current-user';
import { getTeamById } from '@/data/team';

interface UseStripePricingProps {
	enabled: boolean;
	price: 'basic' | 'pro' | 'enterprise' | null;
	stripeCustomerId: string;
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('Stripe publishable key not found');
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

export function useStripePricing(props: UseStripePricingProps) {
	const user = useCurrentUser();
	useEffect(() => {
		(async () => {
			if (!props.enabled || !props.price) return;
			const pricingPlan = JSON.parse(JSON.stringify(plans[props.price]));

			try {
				const data = await createCheckoutSession({
					priceId: pricingPlan.stripePricingId,
					subscription: !!(pricingPlan.type === 'subscription'),
					email: user?.email ?? '',
					userId: user?.id ?? '',
					teamId: user?.currentTeam ?? '',
					stripeCustomerId: props.stripeCustomerId ?? '',
				});

				if (data.updated) {
					return toast({
						description: 'Your subscription has been updated',
					});
				}

				if (data.error) {
					toast({
						description: data.error,
						variant: 'destructive',
					});
					return;
				} else {
					const stripe = await stripePromise;
					const result = await stripe?.redirectToCheckout({
						sessionId: data.sessionId ?? '',
					});

					return result;
				}
			} catch (error) {
				toast({
					description: 'An error occurred while loading pricing',
					variant: 'destructive',
				});
				console.error('Error loading stripe pricing', error);
			}
		})();
	}, [props.enabled]);
}
