import CancelSubscriptionButton from '@/components/billing/cancel-subscription-button';
import PricingPlans from '@/components/billing/pricing-plans';
import { Separator } from '@/components/ui/separator';
import { getTeamById, getTeamCustomerByTeamId } from '@/data/team';
import { currentUser } from '@/lib/auth';
import plans from '@/plans';
import { Suspense } from 'react';

if (!process.env.STRIPE_WEBHOOK_SECRET) {
	throw new Error(
		'Stripe webhook secret not found. A setup guide can be found in the documentation'
	);
}

export default async function BillingPage({ params }: { params: { team: string } }) {
	const user = await currentUser();
	const team = await getTeamById(params.team ?? '');
	const customer = await getTeamCustomerByTeamId(params.team ?? '');
	// const isOwner = await isTeamOwner(team?.team?.members ?? [], user?.id ?? '');

	const teamHasPlan = !!customer?.id && customer?.status === 'active';

	const currentTeamPlan = Object.entries(plans).find(
		(plan) => plan?.[1]?.stripePricingId === customer?.planId
	)?.[1];

	const isOwner = team?.data?.currentMember?.role === 'OWNER';

	return (
		<main className="flex flex-col  gap-4 h-full">
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
						<p>You must be the team owner to setup/manage billing</p>
					)
				) : null}

				<div className="mb-4">
					<PricingPlans
						type="one time"
						readOnly={!isOwner || !user?.currentTeam}
						teamId={team.data?.team?.id ?? ''}
						stripeCustomerId={team?.data?.team?.stripeCustomerId ?? ''}
						currentPlanId={currentTeamPlan?.stripePricingId}
					/>
				</div>
				{teamHasPlan && currentTeamPlan?.type === 'subscription' && isOwner ? (
					<div className="flex flex-col gap-4 h-full">
						<div className="mt-auto">
							<CancelSubscriptionButton
								customer={customer}
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
