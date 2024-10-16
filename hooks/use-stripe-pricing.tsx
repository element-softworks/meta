'use client';

import { createCheckoutSession } from '@/actions/create-checkout-session';
import { toast } from '@/components/ui/use-toast';
import plans from '@/plans';
import { loadStripe } from '@stripe/stripe-js';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCurrentUser } from './use-current-user';

interface UseStripePricingProps {
	enabled: boolean;
	price: 'basic' | 'pro' | 'enterprise' | 'starter' | 'full access' | null;
	stripeCustomerId: string;
	teamId: string;
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error(
		'Stripe publishable key not found. A setup guide can be found in the documentation'
	);
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

export function useStripePricing(props: UseStripePricingProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const user = useCurrentUser();
	useEffect(() => {
		(async () => {
			if (!props.enabled || !props.price) return;
			setIsLoading(true);
			const pricingPlan = JSON.parse(JSON.stringify(plans[props.price]));

			try {
				const data = await createCheckoutSession({
					priceId: pricingPlan.stripePricingId,
					subscription: !!(pricingPlan.type === 'subscription'),
					email: user?.email ?? '',
					userId: user?.id ?? '',
					teamId: props.teamId ?? '',
					stripeCustomerId: props.stripeCustomerId ?? '',
				});

				if (data.updated) {
					setIsLoading(false);

					router.push(`/dashboard/teams/${user?.currentTeam}`);
					return toast({
						description: 'Your subscription has been updated',
					});
				}

				if (data.error) {
					setIsLoading(false);
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
					setIsLoading(false);

					return result;
				}
			} catch (error) {
				setIsLoading(false);
				toast({
					description: 'An error occurred while loading pricing',
					variant: 'destructive',
				});
				console.error('Error loading stripe pricing', error);
			}
		})();
	}, [props.enabled]);

	return { isLoading };
}
