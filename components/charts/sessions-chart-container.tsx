'use server';

import { getSessionAnalytics } from '@/actions/get-session-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addDays, endOfDay, format } from 'date-fns';
import { SessionsChart } from './sessions-chart';

export async function SessionsChartContainer({ searchParams }: { searchParams: any }) {
	const startDate = searchParams?.['new-payments-startDate'];
	const endDate = searchParams?.['new-payments-endDate'];
	const dataTypeQuery = searchParams?.['new-payments-dateType'];

	const paymentsResponse = await getSessionAnalytics(
		!!startDate?.length ? startDate : addDays(new Date(), -6).toISOString(),
		!!endDate?.length ? endDate : endOfDay(new Date()).toISOString()
	);

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
		chartTitle = 'Session analytics';
	}

	const chartConfig = {
		views: {
			label: 'Page Views',
		},
		desktop: {
			label: 'Desktop',
			color: 'hsl(var(--chart-1))',
		},
		mobile: {
			label: 'Mobile',
			color: 'hsl(var(--chart-2))',
		},
	} satisfies ChartConfig;

	return (
		<>
			<SessionsChart
				searchParams={searchParams}
				chartData={paymentsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description="Amount of sessions over time"
			/>
		</>
	);
}
