import { ReportBugDialog } from '@/components/dialogs/report-bug-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import plans from '@/plans';
import Link from 'next/link';

export default async function DashboardPage() {
	const user = await currentUser();
	const team = await getTeamById(user?.currentTeam ?? '');
	const plan = Object.entries(plans).find(
		(plan) => plan?.[1]?.stripePricingId === team?.data?.customer?.planId
	)?.[1];

	return (
		<main className="flex flex-col  gap-4 h-full">
			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-2xl font-bold">Welcome, {user?.name ?? 'User'}</p>
					<p className="text-muted-foreground text-sm max-w-xl">
						You are currently logged in as {user?.email ?? ''}
					</p>
				</div>
			</div>
			<Separator />

			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<p className="text-xl font-bold">
						{team?.data?.team?.name}
						{"'"}s dashboard
					</p>
				</div>
			</div>

			<div className="grid grid-cols-12 gap-4">
				<Card className="col-span-12 lg:col-span-4">
					<CardHeader>
						<div className="flex gap-4">
							<CardTitle className="flex-1">Active plan</CardTitle>
							<Badge color="primary">{!!plan?.name ? plan.name : 'No plan'}</Badge>
						</div>
						<CardDescription>Manage/view your teams plan details</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="flex gap-2 items-center">
							<div className="flex-1">
								{!!plan?.name?.length ? (
									<p className="text-lg font-semibold">Plan details</p>
								) : null}
								<div className="">
									{plan?.features.map((feature, index) => {
										if (!feature?.active) return null;
										return (
											<p
												className="text-muted-foreground text-sm"
												key={index}
											>
												{feature?.feature}
											</p>
										);
									})}
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Link
							className="w-full"
							href={`/dashboard/teams/${team.data?.team?.id}/billing`}
						>
							<Button className="w-full">
								{!!plan?.name?.length ? 'Manage plan' : 'Subscribe to a plan'}
							</Button>
						</Link>
					</CardFooter>
				</Card>
				<div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-fit">
					<Card className="flex flex-col">
						<CardHeader>
							<CardTitle>Team details</CardTitle>
							<CardDescription>View and manage team</CardDescription>
						</CardHeader>

						<CardFooter className="mt-auto">
							<Link
								className="w-full"
								href={`/dashboard/teams/${team.data?.team?.id}`}
							>
								<Button variant="secondary" className="w-full">
									View team details
								</Button>
							</Link>
						</CardFooter>
					</Card>

					<Card className="flex flex-col">
						<CardHeader>
							<CardTitle>Team invoices</CardTitle>
							<CardDescription>View and manage team invoices</CardDescription>
						</CardHeader>

						<CardFooter className="mt-auto">
							<Link
								className="w-full"
								href={`/dashboard/teams/${team.data?.team?.id}/invoices`}
							>
								<Button variant="secondary" className="w-full">
									Manage invoices
								</Button>
							</Link>
						</CardFooter>
					</Card>

					<Card className="flex flex-col">
						<CardHeader>
							<CardTitle>Report an issue</CardTitle>
							<CardDescription>Found a bug? Report it</CardDescription>
						</CardHeader>

						<CardFooter className="mt-auto">
							<ReportBugDialog
								button={
									<Button variant="secondary" className="w-full">
										Report issue
									</Button>
								}
							/>
						</CardFooter>
					</Card>
				</div>
			</div>
		</main>
	);
}
