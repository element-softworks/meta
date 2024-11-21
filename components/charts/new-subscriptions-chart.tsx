'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { DateSelectorPicker } from '../general/date-selector-picker';

interface NewSubscriptionsChartProps {
	searchParams: any;
	chartConfig: ChartConfig;
	chartData: { time: string; count: number }[] | undefined;
	title: string;
	description: string;
}

export function NewSubscriptionsChart(props: NewSubscriptionsChartProps) {
	return (
		<Card className="">
			<CardHeader className="flex flex-col lg:flex-row gap-4">
				<div className="flex-1">
					<CardTitle>{props.title}</CardTitle>
					<CardDescription>{props.description}</CardDescription>
				</div>
				<DateSelectorPicker searchParams={props.searchParams} id="new-subscriptions" />
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={props.chartConfig}
					className="overflow-scroll aspect-auto h-[300px]"
				>
					<BarChart
						accessibilityLayer
						data={props.chartData}
						className="min-w-[300px] [&_svg]:!w-fit"
					>
						<CartesianGrid vertical={false} />
						<YAxis tickLine={false} axisLine={false} />
						<XAxis dataKey="time" tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dashed" />}
						/>
						<Bar dataKey="count" fill="var(--color-hour)" radius={2} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
