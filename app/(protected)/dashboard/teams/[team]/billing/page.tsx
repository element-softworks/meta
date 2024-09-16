import CancelSubscriptionButton from '@/components/billing/cancel-subscription-button';
import PricingPlans from '@/components/billing/pricing-plans';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isTeamOwner } from '@/lib/team';
import { Suspense } from 'react';

export default async function SettingsPage() {
	const user = await currentUser();
	const team = await getTeamById(user?.currentTeam ?? '');
	const isOwner = await isTeamOwner(team?.team?.members ?? [], user?.id ?? '');

	const subscription = await db.customer.findFirst({
		where: {
			stripeCustomerId: team?.team?.stripeCustomerId ?? '',
		},
	});

	const teamHasPlan =
		!!team?.team?.subscriptions?.length && team?.team?.subscriptions?.[0]?.status === 'active';
	const currentSubscription = team?.team?.subscriptions?.[0];

	console.log(subscription, 'cancelAtPeriodEnd');

	return (
		<main className="flex flex-col max-w-5xl gap-6">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Billing settings</p>
					<p className="text-muted-foreground text-sm">
						Upgrade, manage and pay for your plan here
					</p>
				</div>
			</div>
			<Separator />

			<Suspense fallback={<>...</>}>
				{!isOwner && !teamHasPlan ? (
					!user?.currentTeam ? (
						<p>You must create a team to setup billing</p>
					) : (
						<p>You must be the team owner to setup billing</p>
					)
				) : null}

				{teamHasPlan ? (
					<div className="flex flex-col gap-4">
						<p className="text-lg font-bold">Current plan</p>
						<div className="flex flex-col gap-2">
							<p className="text-lg font-bold">
								{team?.team?.subscriptions[0]?.planId}
							</p>
							<p className="text-muted-foreground">
								{team?.team?.subscriptions[0]?.planId}
							</p>
						</div>
						<CancelSubscriptionButton
							customer={subscription}
							userId={user?.id ?? ''}
							teamId={team.team?.id ?? ''}
						/>
						<Separator />
					</div>
				) : (
					isOwner && (
						<PricingPlans stripeCustomerId={team?.team?.stripeCustomerId ?? ''} />
					)
				)}
			</Suspense>
		</main>
	);
}
