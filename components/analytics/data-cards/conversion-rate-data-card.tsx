import { getConversionRate } from '@/actions/get-conversion-rate';
import { Handshake, Percent } from 'lucide-react';
import { DataCard } from '../../data-card';

interface ConversionRateDataCardProps {}

export default async function ConversionRateDataCard(props: ConversionRateDataCardProps) {
	const conversionRateResponse = await getConversionRate();

	return (
		<DataCard
			title={`${conversionRateResponse.conversionRate}%`}
			subtitle="Conversion Rate"
			descriptor="Overall"
			icon={<Handshake size={20} />}
		/>
	);
}
