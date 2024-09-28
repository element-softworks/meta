import { addDays, addHours, addMonths, addWeeks, startOfDay, subDays, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { MoveDown, MoveLeft, MoveUp } from 'lucide-react';
import { DataCard } from '../data-card';
import { AnalyticsIcon } from '@/app/analytics-icon';
import { getUniqueSessionsCount } from '@/actions/get-unique-sessions-count';

interface UniqueSessionsDataCardProps {
	title: string;
	subtitle: string | React.ReactNode;
	analytic?: number;
	analyticSuffix?: string;
	icon?: React.ReactNode;
	loading?: boolean;
}

export async function UniqueSessionsDataCard(props: UniqueSessionsDataCardProps) {
	let startDate = subDays(new Date(), 30);

	const sessionsResponse = await getUniqueSessionsCount(
		startDate.toISOString(),
		new Date().toISOString()
	);

	return (
		<DataCard
			title={sessionsResponse?.sessions?.unique ?? 0}
			subtitle={props.title}
			descriptor={props.subtitle}
			icon={props.icon}
			change={
				<>
					<CardDescription className="flex-1 text-right">
						{sessionsResponse?.percentageDifference}%
					</CardDescription>
					<AnalyticsIcon
						className="flex-1"
						percentage={Number(sessionsResponse?.percentageDifference)}
					/>
				</>
			}
		/>
	);
}
