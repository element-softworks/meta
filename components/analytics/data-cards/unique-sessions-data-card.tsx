import { getUniqueSessionsCount } from '@/actions/get-unique-sessions-count';
import { AnalyticsIcon } from '@/app/analytics-icon';
import { subDays } from 'date-fns';
import { DataCard } from '../../data-card';
import { CardDescription } from '../../ui/card';

interface UniqueSessionsDataCardProps {
	title: string;
	subtitle: string | React.ReactNode;
	analytic?: number;
	analyticSuffix?: string;
	icon?: React.ReactNode;
	loading?: boolean;
}

export default async function UniqueSessionsDataCard(props: UniqueSessionsDataCardProps) {
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
