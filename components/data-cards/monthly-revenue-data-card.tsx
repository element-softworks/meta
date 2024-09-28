import { getRevenueAnalytics } from '@/actions/get-revenue-analytics';
import { AnalyticsIcon } from '@/app/analytics-icon';
import { Landmark } from 'lucide-react';
import { DataCard } from '../data-card';
import { CardDescription } from '../ui/card';

interface MonthlyRevenueDataCardProps {}

export async function MonthlyRevenueDataCard(props: MonthlyRevenueDataCardProps) {
	const revenueAnalytics = await getRevenueAnalytics();

	let UkCurrency = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});

	return (
		<DataCard
			title={UkCurrency.format(Number(revenueAnalytics.revenue))}
			subtitle="Recurring revenue"
			descriptor="Monthly"
			icon={<Landmark size={20} />}
			change={
				<>
					<CardDescription className="flex-1 text-right">
						{revenueAnalytics?.percentage}%
					</CardDescription>
					<AnalyticsIcon
						className="flex-1"
						percentage={Number(revenueAnalytics?.percentage)}
					/>
				</>
			}
		/>
	);
}
