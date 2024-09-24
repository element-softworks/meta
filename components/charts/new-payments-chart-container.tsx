'use server';

import { ChartConfig } from '@/components/ui/chart';
import { DataChart } from './data-chart';
import { getSubscriptionAnalytics } from '@/actions/get-payment-analytics';
import { addDays, endOfDay, format, startOfDay } from 'date-fns';

export async function NewPaymentsChartContainer({ searchParams }: { searchParams: any }) {
	const paymentsResponse = await getSubscriptionAnalytics(
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

	let chartTitle = '';

	if (dataTypeQuery === 'week') {
		chartTitle = 'New payments last week';
	} else if (dataTypeQuery === 'month') {
		chartTitle = 'New payments last month';
	} else if (
		dataTypeQuery === 'custom' &&
		!!searchParams.startDate?.length &&
		!!searchParams.endDate?.length
	) {
		chartTitle = `New payments from ${format(
			new Date(searchParams.startDate),
			'dd LLL'
		)} to ${format(new Date(searchParams.endDate), 'dd LLL')}`;
	} else {
		chartTitle = 'New payments today';
	}

	return (
		<>
			<DataChart
				chartData={paymentsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description="Amount of payments over time"
			/>
		</>
	);
}
