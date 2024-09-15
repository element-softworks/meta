'use client';
import { Button } from '@/components/ui/button';
import { useStripePricing } from '@/hooks/use-stripe-pricing';
import { useState } from 'react';

interface CheckoutProps {
	stripeCustomerId: string;
}

export default function Checkout(props: CheckoutProps) {
	const [price, setPrice] = useState<'basic' | 'pro' | 'enterprise' | null>(null);

	useStripePricing({ enabled: !!price, price, stripeCustomerId: props.stripeCustomerId });
	return (
		<>
			<Button
				onClick={() => {
					setPrice('basic');
				}}
			>
				Basic
			</Button>

			<Button
				onClick={() => {
					setPrice('pro');
				}}
			>
				Pro
			</Button>

			<Button
				onClick={() => {
					setPrice('enterprise');
				}}
			>
				Enterprise
			</Button>
		</>
	);
}
