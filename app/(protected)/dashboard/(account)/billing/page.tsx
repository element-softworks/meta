'use client';
import { CheckoutForm } from '@/components/forms/checkout-form';
import convertToSubCurrency from '@/lib/convertToSubCurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Separator } from '@/components/ui/separator';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
	throw new Error('Stripe publishable key not found');
}

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

export default async function SettingsPage() {
	return (
		<main className="flex flex-col max-w-3xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Billing settings</p>
					<p className="text-muted-foreground text-sm">
						Upgrade, manage and pay for your plan here
					</p>
				</div>
			</div>
			<Separator />
			<Elements
				stripe={stripePromise}
				options={{
					mode: 'payment',
					currency: 'gbp',
					amount: convertToSubCurrency(49.99),
				}}
			>
				<CheckoutForm amount={49.99} />
			</Elements>
		</main>
	);
}
