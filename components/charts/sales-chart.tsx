'use client';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart } from 'recharts';

import { useMemo, useState } from 'react';
import { DateSelectorPicker } from '../general/date-selector-picker';
import { Button } from '../ui/button';
import { ChartColumnBig, ChartLine } from 'lucide-react';
interface SalesChart {
	searchParams: any;
	chartConfig: ChartConfig;
	chartData: { time: string; amount: number }[] | undefined;
	title: string;
	description: string;
}

export function SalesChart(props: SalesChart) {
	const [activeChart, setActiveChart] = useState<keyof typeof props.chartConfig>('amount');
	const total = useMemo(
		() => ({
			amount: props?.chartData?.reduce((acc, curr) => acc + curr.amount, 0),
		}),
		[props.chartData]
	);

	const [type, setType] = useState('line');

	const chartContent = (
		<>
			<CartesianGrid vertical={false} />
			<XAxis
				dataKey="time"
				tickLine={false}
				axisLine={false}
				tickMargin={8}
				minTickGap={40}
			/>
			<ChartTooltip content={<ChartTooltipContent className="w-[150px]" nameKey="views" />} />
			{type === 'line' && (
				<Line
					dataKey={activeChart}
					type="monotone"
					stroke={`var(--color-${activeChart})`}
					strokeWidth={2}
					dot={false}
				/>
			)}
			{type === 'bar' && <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />}
		</>
	);
	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col lg:flex-row justify-center lg:justify-start lg:items-start gap-1 lg:gap-4 px-4 py-4 sm:py-4">
					<div className="flex-1 flex gap-2 ">
						<div className="flex-1">
							<CardTitle>{props.title}</CardTitle>
							<CardDescription>{props.description}</CardDescription>
						</div>
						<Button
							variant="outline"
							className="w-fit py-2 px-2.5"
							onClick={() => {
								setType(type === 'line' ? 'bar' : 'line');
							}}
							aria-label="Toggle graph line or chart"
						>
							{type === 'line' ? (
								<ChartColumnBig size={20} />
							) : (
								<ChartLine size={20} />
							)}
						</Button>
					</div>
					<div className="">
						<DateSelectorPicker
							default="month"
							searchParams={props.searchParams}
							id="sales"
							longRanges
						/>
					</div>
				</div>

				<div className="flex">
					{['amount'].map((key, index) => {
						const chart = key as keyof typeof props.chartConfig;
						return (
							<div
								key={index}
								data-active={activeChart === chart}
								className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
							>
								<span className="text-xs text-muted-foreground">
									{props.chartConfig[chart].label}
								</span>
								<span className="text-lg font-bold leading-none sm:text-3xl">
									£{total?.[key as keyof typeof total]?.toLocaleString()}
								</span>
							</div>
						);
					})}
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer config={props.chartConfig} className="aspect-auto h-[250px] w-full">
					{type === 'line' ? (
						<LineChart
							accessibilityLayer
							data={props.chartData}
							margin={{ left: 12, right: 12 }}
						>
							{chartContent}
						</LineChart>
					) : (
						<BarChart
							accessibilityLayer
							data={props.chartData}
							margin={{ left: 12, right: 12 }}
						>
							{chartContent}
						</BarChart>
					)}
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
