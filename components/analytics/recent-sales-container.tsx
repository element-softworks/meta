'use server';

import { getInvoices } from '@/actions/get-invoices';
import { RecentSales } from './recent-sales';

export default async function RecentSalesContainer() {
	const sales = await getInvoices();

	return (
		<div className="">
			<RecentSales
				title="Recent sales"
				description="Most recent successful payments made"
				sales={sales}
			/>
		</div>
	);
}
