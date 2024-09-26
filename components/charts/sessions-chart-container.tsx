'use server';

import { getSessionAnalytics } from '@/actions/get-session-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addDays, addMonths, addWeeks, endOfDay, format } from 'date-fns';
import { SessionsChart } from './sessions-chart';

export async function SessionsChartContainer({
	searchParams,
	type,
}: {
	searchParams: any;
	type: 'bar' | 'line';
}) {
	const startDate = searchParams?.['sessions-startDate'];
	const endDate = searchParams?.['sessions-endDate'];
	const dataTypeQuery = searchParams?.['sessions-dateType'];

	const paymentsResponse = await getSessionAnalytics(
		!!startDate?.length ? startDate : addMonths(new Date(), -3).toISOString(),
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

	// <CardTitle>Total visitors</CardTitle>
	// <CardDescription>Showing total visitors for the last 3 months</CardDescription>

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
				type={type}
				searchParams={searchParams}
				chartData={paymentsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description="Amount of sessions over time"
			/>
		</>
	);
}
