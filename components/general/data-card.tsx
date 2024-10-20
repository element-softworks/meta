'use client';

import Tooltip from './tooltip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface DataCardProps {
	title: string | React.ReactNode;
	subtitle: string | React.ReactNode;
	descriptor?: string | React.ReactNode;
	icon?: React.ReactNode;
	change?: React.ReactNode;
	tooltip?: string;
}

export function DataCard(props: DataCardProps) {
	return (
		<Tooltip text={props.tooltip} className="bottom-[135px]">
			<Card className={`w-full sm:w-fit`}>
				<CardHeader className="flex flex-row gap-10">
					<div className="flex-1">
						<CardDescription>{props.subtitle}</CardDescription>
						<CardTitle>{props.title}</CardTitle>
					</div>
					{props.icon}
				</CardHeader>
				<CardContent></CardContent>
				<CardFooter className="flex gap-10">
					<CardDescription className="flex-1 whitespace-nowrap">
						{props.descriptor}
					</CardDescription>
					<div className="flex gap-1 items-center text-xs">{props.change}</div>
				</CardFooter>
			</Card>
		</Tooltip>
	);
}
