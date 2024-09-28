'use server';

import { getSaleAnalytics } from '@/actions/get-sale-analytics';
import { ChartConfig } from '@/components/ui/chart';
import { addMonths, endOfDay, subMonths } from 'date-fns';
import { SalesChart } from './sales-chart';

export default async function SalesChartContainer({ searchParams }: { searchParams: any }) {
	const startDate = searchParams?.['sales-startDate'];
	const endDate = searchParams?.['sales-endDate'];
	const dataTypeQuery = searchParams?.['sales-dateType'];

	const paymentsResponse = await getSaleAnalytics(
		!!startDate?.length ? startDate : subMonths(new Date(), 1).toISOString(),
		!!endDate?.length ? endDate : endOfDay(new Date()).toISOString()
	);

	let chartTitle = '';
	let chartDescription = '';

	if (dataTypeQuery === 'week') {
		chartTitle = 'Total sales past week';
		chartDescription = 'Displaying the number of sales recorded over the last 7 days.';
	} else if (dataTypeQuery === 'month') {
		chartTitle = 'Total sales past month';
		chartDescription = 'Showing sale data for the last 30 days.';
	} else if (dataTypeQuery === 'year') {
		chartTitle = 'Total sales past year';
		chartDescription = 'Visualizing sale data from the past 12 months.';
	} else if (dataTypeQuery === '3 months') {
		chartTitle = 'Total sales past 3 months';
		chartDescription = 'Aggregated sale data from the last 3 months.';
	} else if (dataTypeQuery === '6 months') {
		chartTitle = 'Total sales past 6 months';
		chartDescription = 'Total sales recorded in the past 6 months.';
	} else if (dataTypeQuery === 'today') {
		chartTitle = 'Total sales today';
		chartDescription = 'Session activity data recorded today';
	} else {
		chartTitle = 'Total sales past month';
		chartDescription = 'Showing sale data for the last 30 days.';
	}

	const chartConfig = {
		views: {
			label: 'Amount',
		},
		amount: {
			label: 'Amount',
			color: 'hsl(var(--chart-1))',
		},
	} satisfies ChartConfig;

	return (
		<>
			<SalesChart
				searchParams={searchParams}
				chartData={paymentsResponse?.payments}
				chartConfig={chartConfig}
				title={chartTitle}
				description={chartDescription}
			/>
		</>
	);
}
