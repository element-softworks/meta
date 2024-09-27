import { getSessionsCount } from '@/actions/get-sessions-count';
import { addDays, addHours, addWeeks, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { MoveDown, MoveLeft, MoveUp } from 'lucide-react';
import { DataCard } from '../data-card';

interface SessionsDataCardProps {
	variant: 'today' | 'week' | 'now';
	title: string;
	subtitle: string | React.ReactNode;
	analytic?: number;
	analyticSuffix?: string;
	icon?: React.ReactNode;
	loading?: boolean;
}

export async function SessionsDataCard(props: SessionsDataCardProps) {
	let startDate = new Date();

	if (props.variant === 'week') {
		startDate = addWeeks(new Date(), -1);
	} else if (props.variant === 'today') {
		startDate = startOfDay(new Date());
	} else {
		startDate = startOfDay(new Date());
	}

	const sessionsResponse = await getSessionsCount(
		startDate.toISOString(),
		new Date().toISOString(),
		props.variant === 'now'
	);

	const icon =
		Number(sessionsResponse?.percentageDifference) === 0 ? (
			<MoveLeft size={20} className="text-neutral-500" />
		) : Number(sessionsResponse?.percentageDifference) > 0 ? (
			<MoveUp size={20} className="text-successful" />
		) : (
			<MoveDown size={20} className="text-destructive" />
		);
	return (
		<DataCard
			title={sessionsResponse?.sessions?.count ?? 0}
			subtitle={props.title}
			descriptor={props.subtitle}
			icon={props.icon}
			change={
				props.variant !== 'now' ? (
					<>
						<CardDescription className="flex-1 text-right">
							{sessionsResponse?.percentageDifference}%
						</CardDescription>
						<div className="">{icon}</div>
					</>
				) : null
			}
		/>
	);
}
