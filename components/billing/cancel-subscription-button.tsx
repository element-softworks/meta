'use client';
import { cancelSubscription } from '@/actions/payment/cancelSubscription';
import { uncancelSubscription } from '@/actions/payment/uncancelSubscription';
import { Button } from '@/components/ui/button';
import { Customer } from '@/db/drizzle/schema/customer';
import { useMutation } from '@/hooks/use-mutation';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface CancelSubscriptionButtonProps {
	userId: string;
	customer: Customer | undefined;
}

export default function CancelSubscriptionButton(props: CancelSubscriptionButtonProps) {
	const router = useRouter();
	const {
		query: cancelSubscriptionQuery,
		isLoading,
		data: cancelData,
	} = useMutation<{}, {}>({
		queryFn: async (values) =>
			await cancelSubscription(props.customer?.stripeCustomerId ?? '', props.userId),
		onSuccess: () => {
			router.push(`/dashboard/users/${props.userId}`);
		},
	});

	const {
		query: unCancelSubscriptionQuery,
		isLoading: isLoadingUncancel,
		data,
	} = useMutation<{}, {}>({
		queryFn: async (values) =>
			await uncancelSubscription(props.customer?.stripeCustomerId ?? '', props.userId),
		onSuccess: () => {
			router.push(`/dashboard/users/${props.userId}`);
		},
	});

	if (props.customer?.cancelAtPeriodEnd) {
		return (
			<div className="flex flex-col gap-2 w-fit">
				<p className="text-sm">
					Subscription will terminate on{' '}
					{format(new Date(props.customer?.endDate ?? Date.now()), 'MMM d, yyyy')}
				</p>
				<Button
					isLoading={isLoadingUncancel}
					disabled={isLoadingUncancel}
					className="w-fit"
					onClick={() => {
						unCancelSubscriptionQuery();
					}}
					variant="destructive"
				>
					Cancel termination
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 w-fit">
			<p className="text-sm">
				Subscription renews on{' '}
				{format(new Date(props.customer?.endDate ?? new Date()), 'MMM d, yyyy')}
			</p>
			<Button
				className="w-fit"
				isLoading={isLoading}
				disabled={isLoading}
				onClick={() => {
					cancelSubscriptionQuery();
				}}
				variant="destructive"
			>
				Cancel subscription
			</Button>
		</div>
	);
}
