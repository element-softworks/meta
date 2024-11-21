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
interface SessionsChart {
	searchParams: any;
	chartConfig: ChartConfig;
	chartData: { time: string; desktop: number; mobile: number }[] | undefined;
	title: string;
	description: string;
}

export function SessionsChart(props: SessionsChart) {
	const [activeChart, setActiveChart] = useState<keyof typeof props.chartConfig>('all');
	const total = useMemo(
		() => ({
			desktop: props?.chartData?.reduce((acc, curr) => acc + curr.desktop, 0),
			mobile: props?.chartData?.reduce((acc, curr) => acc + curr.mobile, 0),
			all: props?.chartData?.reduce((acc, curr) => acc + curr.desktop + curr.mobile, 0),
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
			{activeChart !== 'all' && (
				<ChartTooltip
					content={<ChartTooltipContent className="w-[150px]" nameKey="views" />}
				/>
			)}
			{type === 'line' && activeChart !== 'all' && (
				<Line
					dataKey={activeChart}
					type="monotone"
					stroke={`var(--color-${activeChart})`}
					strokeWidth={2}
					dot={false}
				/>
			)}
			{type === 'bar' && activeChart !== 'all' && (
				<Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
			)}

			{activeChart === 'all' && (
				<>
					{type === 'line' && (
						<>
							<ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
							<Line
								dataKey="desktop"
								type="monotone"
								stroke={`var(--color-desktop)`}
								strokeWidth={2}
								dot={false}
								label="Desktop"
							/>
							<Line
								dataKey="mobile"
								type="monotone"
								stroke={`var(--color-mobile)`}
								strokeWidth={2}
								dot={false}
								label="Mobile"
							/>
						</>
					)}

					{type === 'bar' && (
						<>
							<ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
							<Bar dataKey="desktop" strokeWidth={2} fill={`var(--color-desktop)`} />
							<Bar dataKey="mobile" strokeWidth={2} fill={`var(--color-mobile)`} />
						</>
					)}
				</>
			)}
		</>
	);
	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 xl:flex-row">
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
							default="3 months"
							searchParams={props.searchParams}
							id="sessions"
							longRanges
						/>
					</div>
				</div>

				<div className="flex flex-wrap">
					{['all', 'desktop', 'mobile'].map((key, index) => {
						const chart = key as keyof typeof props.chartConfig;
						return (
							<button
								key={index}
								data-active={activeChart === chart}
								className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l xl:border-t-0 sm:px-8 sm:py-6"
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
