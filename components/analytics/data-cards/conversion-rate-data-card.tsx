import { getConversionRate } from '@/actions/analytics/get-conversion-rate';
import { Handshake, Percent } from 'lucide-react';
import { DataCard } from '../../general/data-card';

interface ConversionRateDataCardProps {}

export default async function ConversionRateDataCard(props: ConversionRateDataCardProps) {
	const conversionRateResponse = await getConversionRate();

	return (
		<DataCard
			tooltip="Chance of a unique IP address converting to a sale."
			title={`${conversionRateResponse.conversionRate}%`}
			subtitle="Conversion rate"
			descriptor="Overall"
			icon={<Handshake size={20} />}
		/>
	);
}
