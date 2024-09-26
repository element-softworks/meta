'use server';

import { getSessionAnalytics } from '@/actions/get-session-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addDays, addMonths, addWeeks, endOfDay, format } from 'date-fns';
import { SessionsChart } from './sessions-chart';

export async function SessionsChartContainer({ searchParams }: { searchParams: any }) {
	const startDate = searchParams?.['sessions-startDate'];
	const endDate = searchParams?.['sessions-endDate'];
	const dataTypeQuery = searchParams?.['sessions-dateType'];

	const paymentsResponse = await getSessionAnalytics(
		!!startDate?.length ? startDate : addMonths(new Date(), -3).toISOString(),
		!!endDate?.length ? endDate : endOfDay(new Date()).toISOString()
	);

	let chartTitle = '';
	let chartDescription = '';

	if (dataTypeQuery === 'week') {
		chartTitle = 'Total sessions past week';
		chartDescription = 'Displaying the number of sessions recorded over the last 7 days.';
	} else if (dataTypeQuery === 'month') {
		chartTitle = 'Total sessions past month';
		chartDescription = 'Showing session data for the last 30 days.';
	} else if (dataTypeQuery === 'year') {
		chartTitle = 'Total sessions past year';
		chartDescription = 'Visualizing session data from the past 12 months.';
	} else if (dataTypeQuery === '3 months') {
		chartTitle = 'Total sessions past 3 months';
		chartDescription = 'Aggregated session data from the last 3 months.';
	} else if (dataTypeQuery === '6 months') {
		chartTitle = 'Total sessions past 6 months';
		chartDescription = 'Total sessions recorded in the past 6 months.';
	} else if (dataTypeQuery === 'today') {
		chartTitle = 'Total sessions today';
		chartDescription = 'Session activity data recorded today';
	} else {
		chartTitle = 'Total Sessions for the Past 3 Months';
		chartDescription = 'Aggregated session data from the last 3 months.';
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
				description={chartDescription}
			/>
		</>
	);
}
