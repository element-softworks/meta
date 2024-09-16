'use client';
import { cancelSubscription } from '@/actions/cancelSubscription';
import { uncancelSubscription } from '@/actions/uncancelSubscription';
import { Button } from '@/components/ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { Customer } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

interface CancelSubscriptionButtonProps {
	customerId: string;
	teamId: string;
	userId: string;
	customer: Customer | undefined;
}

export default function CancelSubscriptionButton(props: CancelSubscriptionButtonProps) {
	const { update } = useSession();
	const { query: cancelSubscriptionQuery, isLoading } = useMutation<{}, {}>({
		queryFn: async (values) =>
			await cancelSubscription(props.customerId, props.teamId, props.userId),
		onCompleted: () => {
			update();
		},
	});

	const { query: unCancelSubscriptionQuery, isLoading: isLoadingUncancel } = useMutation<{}, {}>({
		queryFn: async (values) =>
			await uncancelSubscription(props.customerId, props.teamId, props.userId),

		onCompleted: () => {
			update();
		},
	});

	if (props.customer?.cancelAtPeriodEnd) {
		return (
			<div className="flex flex-col gap-2 w-fit">
				<p className="text-sm">
					Subscription will terminate on{' '}
					{format(new Date(props.customer?.endDate), 'MMM d, yyyy')}
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
