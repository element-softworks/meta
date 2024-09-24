'use server';

import { ChartConfig } from '@/components/ui/chart';
import { DataChart } from './data-chart';
import { getSubscriptionAnalytics } from '@/actions/get-subscription-analytics';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';

export async function SubscriptionsTodayChartContainer({ searchParams }: { searchParams: any }) {
	const subscriptions = await getSubscriptionAnalytics(
		!!searchParams.startDate?.length
			? startOfDay(new Date(searchParams.startDate)).toISOString()
			: startOfDay(new Date(Date.now())).toISOString(),
		!!searchParams.endDate?.length
			? endOfDay(new Date(searchParams.endDate)).toISOString()
			: endOfDay(new Date(Date.now())).toISOString()
	);

	const chartConfig = {
		hour: {
			label: 'Hour',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	const dataTypeQuery = searchParams?.dateType;

	const chartTitle =
		dataTypeQuery === 'week'
			? 'Subscriptions last week'
			: dataTypeQuery === 'month'
			? 'Subscriptions last month'
			: dataTypeQuery === 'custom' &&
			  !!searchParams.startDate?.length &&
			  !!searchParams.endDate?.length
			? `Subscriptions from ${format(new Date(searchParams.startDate), 'dd LLL')} to ${format(
					new Date(searchParams.endDate),
					'dd LLL'
			  )}`
			: 'Subscriptions today';

	return (
		<>
			<DataChart
				chartData={subscriptions?.subscriptions}
				chartConfig={chartConfig}
				title={chartTitle}
			/>
		</>
	);
}
