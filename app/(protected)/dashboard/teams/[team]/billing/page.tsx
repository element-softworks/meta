import CancelSubscriptionButton from '@/components/billing/cancel-subscription-button';
import PricingPlans from '@/components/billing/pricing-plans';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { isTeamOwner } from '@/lib/team';
import plans from '@/plans.json';
import { Suspense } from 'react';

export default async function BillingPage({ params }: { params: { team: string } }) {
	const user = await currentUser();
	const team = await getTeamById(params.team ?? '');
	const isOwner = await isTeamOwner(team?.team?.members ?? [], user?.id ?? '');

	const teamHasPlan =
		!!team?.team?.subscriptions?.length && team?.team?.subscriptions?.[0]?.status === 'active';

	const currentTeamPlan = Object.entries(plans).find(
		(plan) => plan?.[1]?.stripePricingId === team?.team?.subscriptions?.[0]?.planId
	)?.[1];

	return (
		<main className="flex flex-col max-w-5xl gap-6 h-full">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">Billing settings</p>
					<p className="text-muted-foreground text-sm max-w-xl">
						Upgrade, manage and pay for your plan here. Subscription upgrades /
						downgrades are charged in full for the new plan and prorated for the old
						plan.
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

				{isOwner && (
					<PricingPlans
						stripeCustomerId={team?.team?.stripeCustomerId ?? ''}
						currentPlanId={currentTeamPlan?.stripePricingId}
					/>
				)}

				{teamHasPlan ? (
					<div className="flex flex-col gap-4 h-full">
						<div className="mt-auto">
							<CancelSubscriptionButton
								customer={team?.team?.subscriptions[0]}
								userId={user?.id ?? ''}
								teamId={user?.currentTeam ?? ''}
							/>
						</div>
					</div>
				) : null}
			</Suspense>
		</main>
	);
}
