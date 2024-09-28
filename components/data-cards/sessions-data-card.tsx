import { getSessionsCount } from '@/actions/get-sessions-count';
import { addDays, addHours, addMonths, addWeeks, startOfDay, subDays, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { MoveDown, MoveLeft, MoveUp } from 'lucide-react';
import { DataCard } from '../data-card';
import { AnalyticsIcon } from '@/app/analytics-icon';

interface SessionsDataCardProps {
	variant: 'today' | 'week' | 'now' | 'unique';
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
		startDate = subDays(new Date(), 7);
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
						<AnalyticsIcon
							className="flex-1"
							percentage={Number(sessionsResponse?.percentageDifference)}
						/>
					</>
				) : null
			}
		/>
	);
}
