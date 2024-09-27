import { Landmark } from 'lucide-react';
import { DataCard } from '../data-card';
import { getMonthlyRevenue } from '@/actions/get-monthly-revenue';

interface MonthlyRevenueDataCardProps {}

export async function MonthlyRevenueDataCard(props: MonthlyRevenueDataCardProps) {
	const monthlyRevenue = await getMonthlyRevenue();

	let UkCurrency = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
	});
	return (
		<DataCard
			title={UkCurrency.format(Number(monthlyRevenue.revenue))}
			subtitle="Monthly revenue"
			descriptor="Total monthly revenue"
			icon={<Landmark size={20} />}
		/>
	);
}
