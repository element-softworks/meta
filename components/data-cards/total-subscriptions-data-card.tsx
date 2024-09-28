import { getRevenueAnalytics } from '@/actions/get-revenue-analytics';
import { AnalyticsIcon } from '@/app/analytics-icon';
import { UserRoundPlus } from 'lucide-react';
import { DataCard } from '../data-card';
import { CardDescription } from '../ui/card';

interface TotalSubscriptionsDataCardProps {}

export async function TotalSubscriptionsDataCard(props: TotalSubscriptionsDataCardProps) {
	const revenueAnalytics = await getRevenueAnalytics();

	return (
		<DataCard
			title={`+${revenueAnalytics.totalCustomers}`}
			subtitle="Total active subscriptions"
			descriptor="Now"
			icon={<UserRoundPlus size={20} />}
			change={
				<>
					<CardDescription className="flex-1 text-right">
						{revenueAnalytics?.customersPercentage}%
					</CardDescription>
					<AnalyticsIcon
						className="flex-1"
						percentage={Number(revenueAnalytics?.customersPercentage)}
					/>
				</>
			}
		/>
	);
}
