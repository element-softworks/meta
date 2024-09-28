import SalesChartContainer from '@/components/charts/sales-chart-container';
import { MonthlyRevenueDataCard } from '@/components/data-cards/monthly-revenue-data-card';
import { SalesDataCard } from '@/components/data-cards/sales-data-card';
import { SessionsDataCard } from '@/components/data-cards/sessions-data-card';
import { TotalSubscriptionsDataCard } from '@/components/data-cards/total-subscriptions-data-card';
import { UniqueSessionsDataCard } from '@/components/data-cards/unique-sessions-data-card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookUser, Radio, Users, Users2 } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { ClipLoader } from 'react-spinners';
const NewPaymentsChartContainer = lazy(
	() => import('@/components/charts/new-subscriptions-chart-container')
);
const SessionsChartContainer = lazy(() => import('@/components/charts/sessions-chart-container'));

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col  gap-4">
			<div className="">
				<p className="text-xl font-bold">Analytics</p>
				<p className="text-muted-foreground text-sm">
					View and analyze your dashboard analytics
				</p>
			</div>

			<Separator />

			<Tabs defaultValue="sessions" className="">
				<TabsList>
					<TabsTrigger value="sessions">Sessions</TabsTrigger>
					<TabsTrigger value="payments">Payments</TabsTrigger>
				</TabsList>
				<TabsContent value="sessions" className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-4 mt-4">
						<SessionsDataCard
							variant="now"
							title="Sessions now"
							subtitle="Live"
							icon={<Radio size={20} />}
						/>
						<SessionsDataCard
							variant="today"
							title="Total sessions"
							subtitle="From today"
							icon={<Users size={20} />}
						/>
						<SessionsDataCard
							variant="week"
							title="Total sessions"
							subtitle="Past week"
							icon={<Users2 size={20} />}
						/>

						<UniqueSessionsDataCard
							title="Unique sessions"
							subtitle="Past month"
							icon={<BookUser size={20} />}
						/>
					</div>

					<Suspense
						fallback={
							<ClipLoader
								className="m-auto !border-t-primary !border-r-primary !border-l-primary"
								size={50}
							/>
						}
					>
						<SessionsChartContainer searchParams={searchParams} />
					</Suspense>
				</TabsContent>
				<TabsContent value="payments" className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-4 mt-4">
						<MonthlyRevenueDataCard />
						<TotalSubscriptionsDataCard />
						<SalesDataCard />
					</div>
					<Suspense
						fallback={
							<ClipLoader
								className="m-auto !border-t-primary !border-r-primary !border-l-primary"
								size={50}
							/>
						}
					>
						<SalesChartContainer searchParams={searchParams} />
					</Suspense>
					<div className="grid grid-cols-1 md:grid-cols-2">
						<Suspense
							fallback={
								<ClipLoader
									className="m-auto !border-t-primary !border-r-primary !border-l-primary"
									size={50}
								/>
							}
						>
							<NewPaymentsChartContainer searchParams={searchParams} />
						</Suspense>
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}
