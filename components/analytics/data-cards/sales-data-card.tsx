import { getRevenueAnalytics } from '@/actions/get-revenue-analytics';
import { AnalyticsIcon } from '@/app/analytics-icon';
import { BadgeCent, Landmark } from 'lucide-react';
import { DataCard } from '../../data-card';
import { CardDescription } from '../../ui/card';
import { getTotalSales } from '@/actions/get-total-sales';
import { subMonths } from 'date-fns';

interface SalesDataCardProps {}

export default async function SalesDataCard(props: SalesDataCardProps) {
	const revenueAnalytics = await getTotalSales(
		subMonths(new Date(), 1).toISOString(),
		new Date().toISOString()
	);

	let UkCurrency = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});

	return (
		<DataCard
			title={UkCurrency.format(Number(revenueAnalytics.sales))}
			subtitle="Sales"
			descriptor="Past month"
			icon={<BadgeCent size={20} />}
			change={
				<>
					<CardDescription className="flex-1 text-right">
						{revenueAnalytics?.salesDifferencePercentage}%
					</CardDescription>
					<AnalyticsIcon
						className="flex-1"
						percentage={Number(revenueAnalytics?.salesDifferencePercentage)}
					/>
				</>
			}
		/>
	);
}
