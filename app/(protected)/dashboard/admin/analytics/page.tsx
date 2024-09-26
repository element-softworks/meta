import { NewPaymentsChartContainer } from '@/components/charts/new-payments-chart-container';
import { SessionsChartContainer } from '@/components/charts/sessions-chart-container';
import { SessionsDataCard } from '@/components/data-cards/sessions-data-card';
import { Separator } from '@/components/ui/separator';

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

			<div className="flex flex-wrap gap-4">
				<SessionsDataCard variant="now" title="Sessions now" subtitle="Live" />
				<SessionsDataCard variant="today" title="Total sessions" subtitle="From today" />
				<SessionsDataCard variant="week" title="Total sessions" subtitle="Past week" />
			</div>
			<SessionsChartContainer searchParams={searchParams} />
			<div className="grid grid-cols-1 md:grid-cols-2">
				<NewPaymentsChartContainer searchParams={searchParams} />
			</div>
		</main>
	);
}
