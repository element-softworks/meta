import CancelSubscriptionButton from '@/components/billing/cancel-subscription-button';
import PricingPlans from '@/components/billing/pricing-plans';
import { Separator } from '@/components/ui/separator';
import { getUserById } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { customer } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import plans from '@/plans';
import { eq } from 'drizzle-orm';
import { Suspense } from 'react';

if (!process.env.STRIPE_WEBHOOK_SECRET) {
	throw new Error(
		'Stripe webhook secret not found. A setup guide can be found in the documentation'
	);
}

export async function generateMetadata({ params }: any) {
	const userResponse = await getUserById(params.user);
	return {
		title: `Billing | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
		description: `Billing for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		openGraph: {
			title: `Billing | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
			description: `Billing for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		},
		twitter: {
			title: `Billing | ${userResponse?.name} | Users | Dashboard | NextJS SaaS Boilerplate`,
			description: `Billing for ${userResponse?.name} on NextJS SaaS Boilerplate.`,
		},
	};
}

export default async function BillingPage({ params }: { params: { team: string } }) {
	const user = await currentUser();
	const [customerResponse] = await db
		.select()
		.from(customer)
		.where(eq(customer.userId, user?.id!));
	// const isOwner = await isTeamOwner(team?.team?.members ?? [], user?.id ?? '');

	const userHasPlan = !!customer?.id && customerResponse?.status === 'active';

	const currentPlan = Object.entries(plans).find(
		(plan) => plan?.[1]?.stripePricingId === customerResponse?.planId
	)?.[1];

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
				<div className="mb-4">
					<PricingPlans
						type="one-time"
						userId={user?.id ?? ''}
						readOnly={false}
						stripeCustomerId={user?.stripeCustomerId ?? ''}
						currentPlanId={currentPlan?.stripePricingId}
					/>
				</div>
				{userHasPlan && currentPlan?.type === 'subscription' ? (
					<div className="flex flex-col gap-4 h-full">
						<div className="mt-auto">
							<CancelSubscriptionButton
								customer={customerResponse}
								userId={user?.id ?? ''}
							/>
						</div>
					</div>
				) : null}
			</Suspense>
		</main>
	);
}
