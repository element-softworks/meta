'use client';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';
import { DateSelectorPicker } from '../date-selector-picker';

interface NewPaymentsChartProps {
	searchParams: any;
	chartConfig: ChartConfig;
	chartData: { time: string; count: number }[] | undefined;
	title: string;
	description: string;
}

export function NewPaymentsChart(props: NewPaymentsChartProps) {
	return (
		<Card className="">
			<CardHeader className="flex flex-col lg:flex-row gap-4">
				<div className="flex-1">
					<CardTitle>{props.title}</CardTitle>
					<CardDescription>{props.description}</CardDescription>
				</div>
				<DateSelectorPicker searchParams={props.searchParams} id="new-payments" />
			</CardHeader>
			<CardContent>
				<ChartContainer config={props.chartConfig} className="overflow-scroll">
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
