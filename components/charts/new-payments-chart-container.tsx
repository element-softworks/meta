'use server';

import { getSubscriptionAnalytics } from '@/actions/get-payment-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addDays, endOfDay, format } from 'date-fns';
import { NewPaymentsChart } from './new-payments-chart';

export default async function NewPaymentsChartContainer({ searchParams }: { searchParams: any }) {
	const startDate = searchParams?.['new-payments-startDate'];
	const endDate = searchParams?.['new-payments-endDate'];
	const dataTypeQuery = searchParams?.['new-payments-dateType'];

	const paymentsResponse = await getSubscriptionAnalytics(
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
		chartTitle = 'New payments past week';
	} else if (dataTypeQuery === 'month') {
		chartTitle = 'New payments past month';
	} else if (dataTypeQuery === 'custom' && !!startDate?.length && !!endDate?.length) {
		chartTitle = `New payments from ${format(new Date(startDate), 'dd LLL')} to ${format(
			new Date(endDate),
			'dd LLL'
		)}`;
	} else {
		chartTitle = 'New payments past week';
	}

	return (
		<>
			<NewPaymentsChart
				searchParams={searchParams}
				chartData={paymentsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description="Amount of payments over time"
			/>
		</>
	);
}
