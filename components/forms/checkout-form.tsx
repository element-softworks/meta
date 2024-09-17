'use client';
import { createPaymentIntent } from '@/actions/create-payment-intent';
import { useMutation } from '@/hooks/use-mutation';
import convertToSubCurrency from '@/lib/convertToSubCurrency';
import { CardElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CenteredLoader } from '../layout/centered-loader';
import { useCurrentUser } from '@/hooks/use-current-user';

interface CheckoutFormProps {
	amount: number;
	type: 'subscription' | 'payment';
}

interface PaymentIntentFormRequest {
	amount: number;
}
interface SubscriptionFormRequest {
	paymentMethod: string;
}

export function CheckoutForm(props: CheckoutFormProps) {
	const user = useCurrentUser();
	const {
		query: paymentIntentQuery,
		isLoading,
		data,
	} = useMutation<PaymentIntentFormRequest, { clientSecret: string }>({
		queryFn: async () =>
			await createPaymentIntent({
				amount: convertToSubCurrency(props.amount),
			}),
	});

	const stripe = useStripe();
	const elements = useElements();

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			if (props.type === 'payment') {
				const response = await paymentIntentQuery();
			}
		})();
	}, [props.amount]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);

		if (!stripe || !elements) {
			return;
		}

		const { error: submitError } = await elements.submit();

		if (submitError) {
			setError(submitError?.message ?? 'An error occurred');
			setLoading(false);
			return;
		}

		if (!data?.clientSecret) return;

		const confirmationLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/teams/${user?.currentTeam}/billing/success?amount=${props.amount}`;

		const { error } = await stripe.confirmPayment({
			elements,
			clientSecret: data?.clientSecret!,
			confirmParams: {
				return_url: confirmationLink,
			},
		});

		if (error) {
			setError('An error occurred');
			setLoading(false);
			return;
		}

		setLoading(false);
	};

	if (!stripe || !data?.clientSecret || !elements) {
		return <CenteredLoader />;
	}

	return (
		<form className="w-full" onSubmit={handleSubmit}>
			{data?.clientSecret && <PaymentElement />}
			<Button className="w-full mt-4" disabled={!stripe || loading} isLoading={loading}>
				{!loading ? `Pay £${props.amount}` : 'Processing...'}
			</Button>
		</form>
	);
}
