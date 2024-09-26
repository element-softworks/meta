'use client';
import { CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';

import { useMemo, useState } from 'react';
interface SessionsChart {
	searchParams: any;
	chartConfig: ChartConfig;
	chartData: { time: string; desktop: number; mobile: number }[] | undefined;
	title: string;
	description: string;
}

export function SessionsChart(props: SessionsChart) {
	const [activeChart, setActiveChart] = useState<keyof typeof props.chartConfig>('desktop');
	const total = useMemo(
		() => ({
			desktop: props?.chartData?.reduce((acc, curr) => acc + curr.desktop, 0),
			mobile: props?.chartData?.reduce((acc, curr) => acc + curr.mobile, 0),
		}),
		[]
	);

	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Bar Chart - Interactive</CardTitle>
					<CardDescription>Showing total visitors for the last 3 months</CardDescription>
				</div>
				<div className="flex">
					{['desktop', 'mobile'].map((key, index) => {
						const chart = key as keyof typeof props.chartConfig;
						return (
							<button
								key={index}
								data-active={activeChart === chart}
								className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
								onClick={() => setActiveChart(chart)}
							>
								<span className="text-xs text-muted-foreground">
									{props.chartConfig[chart].label}
								</span>
								<span className="text-lg font-bold leading-none sm:text-3xl">
									{total?.[key as keyof typeof total]?.toLocaleString()}
								</span>
							</button>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer config={props.chartConfig} className="aspect-auto h-[250px] w-full">
					<BarChart
						accessibilityLayer
						data={props.chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="time"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="views"
									labelFormatter={(value) => {
										return new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
										});
									}}
								/>
							}
						/>
						<Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
