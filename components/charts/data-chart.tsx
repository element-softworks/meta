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

interface DataChartProps {
	chartConfig: ChartConfig;
	chartData: { time: string; count: number }[] | undefined;
	title: string;
	description: string;
}

export function DataChart(props: DataChartProps) {
	return (
		<Card className="overflow-scroll">
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
				<CardDescription>{props.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={props.chartConfig} className="min-w-[500px]">
					<BarChart accessibilityLayer data={props.chartData}>
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
			{/* <CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Showing total customers signed up today
				</div>
			</CardFooter> */}
		</Card>
	);
}
