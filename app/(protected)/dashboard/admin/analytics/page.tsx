import { SubscriptionsTodayChartContainer } from '@/components/charts/subscriptions-today-chart-container';
import { DateSelectorPicker } from '@/components/date-selector-picker';
import { Separator } from '@/components/ui/separator';

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: any }) {
	return (
		<main className="flex flex-col max-w-4xl gap-6">
			<div className="">
				<p className="text-xl font-bold">Analytics</p>
				<p className="text-muted-foreground text-sm">
					View and analyze your dashboard analytics
				</p>
			</div>

			<Separator />

			<DateSelectorPicker searchParams={searchParams} />
			<div className="">
				<SubscriptionsTodayChartContainer searchParams={searchParams} />
			</div>
			{/* {subscriptions?.subscriptions?.map((sub) => {
				return (
					<div>
						{sub?.planId} - {sub?.startDate?.toTimeString()}
					</div>
				);
			})} */}
		</main>
	);
}
