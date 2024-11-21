'use server';

import { getSubscriptionAnalytics } from '@/actions/analytics/get-payment-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addDays, endOfDay, format } from 'date-fns';
import { NewSubscriptionsChart } from './new-subscriptions-chart';

export default async function NewSubscriptionsChartContainer({
	searchParams,
}: {
	searchParams: any;
}) {
	const startDate = searchParams?.['new-subscriptions-startDate'];
	const endDate = searchParams?.['new-subscriptions-endDate'];
	const dataTypeQuery = searchParams?.['new-subscriptions-dateType'];

	const subscriptionsResponse = await getSubscriptionAnalytics(
		!!startDate?.length ? startDate : addDays(new Date(), -6).toISOString(),
		!!endDate?.length ? endDate : endOfDay(new Date()).toISOString()
	);

	const chartConfig = {
		hour: {
			label: 'Hour',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	let chartTitle = '';

	if (dataTypeQuery === 'week') {
		chartTitle = 'New subscriptions past week';
	} else if (dataTypeQuery === 'month') {
		chartTitle = 'New subscriptions past month';
	} else if (dataTypeQuery === 'custom' && !!startDate?.length && !!endDate?.length) {
		chartTitle = `New subscriptions from ${format(new Date(startDate), 'dd LLL')} to ${format(
			new Date(endDate),
			'dd LLL'
		)}`;
	} else {
		chartTitle = 'New subscriptions past week';
	}

	return (
		<>
			<NewSubscriptionsChart
				searchParams={searchParams}
				chartData={subscriptionsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description="Amount of subscriptions over time"
			/>
		</>
	);
}
