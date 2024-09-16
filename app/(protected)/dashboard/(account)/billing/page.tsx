import CancelSubscriptionButton from '@/components/billing/cancel-subscription-button';
import Checkout from '@/components/billing/checkout';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';

export default async function SettingsPage() {
	const user = await currentUser();
	const team = await getTeamById(user?.currentTeam ?? '');

	const teamHasPlan =
		!!team?.team?.subscriptions?.length && team?.team?.subscriptions?.[0]?.status === 'active';
	const currentSubscription = team?.team?.subscriptions?.[0];

	console.log(currentSubscription?.cancelAtPeriodEnd, 'currentSubscription?.cancelAtPeriodEnd');

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

			{teamHasPlan ? (
				<div className="flex flex-col gap-4">
					<p className="text-lg font-bold">Current plan</p>
					<div className="flex flex-col gap-2">
						<p className="text-lg font-bold">{team?.team?.subscriptions[0]?.planId}</p>
						<p className="text-muted-foreground">
							{team?.team?.subscriptions[0]?.planId}
						</p>
					</div>
					<CancelSubscriptionButton
						customer={team?.team?.subscriptions[0]}
						customerId={currentSubscription?.stripeCustomerId ?? ''}
						userId={user?.id ?? ''}
						teamId={team.team?.id ?? ''}
					/>
					<Separator />
				</div>
			) : (
				<Checkout stripeCustomerId={team?.team?.stripeCustomerId ?? ''} />
			)}
		</main>
	);
}
