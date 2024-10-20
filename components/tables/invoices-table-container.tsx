'use server';

import { getTeamInvoices } from '@/actions/payment/get-team-invoices';
import { InvoicesTable } from './invoices-table';

interface InvoicesTableContainerProps {
	searchParams: any;
	teamId: string;
}
export default async function InvoicesTableContainer(props: InvoicesTableContainerProps) {
	// Get the users data and pass filters inside

	const createdAt = props.searchParams?.['invoices-createdAt-sort'] ?? 'desc';

	const invoiceResponse = await getTeamInvoices({
		teamId: props.teamId,
		pageNum: Number(props.searchParams?.['invoices-pageNum'] ?? 1),
		perPage: Number(props.searchParams?.['invoices-perPage'] ?? 100),
		search: props.searchParams?.['invoices-search'] ?? '',
		filters: {
			createdAt,
		},
	});

	const selectedRows = props.searchParams?.['invoices-selectedRows']?.split(',') ?? [];

	//Render the users table
	return (
		<InvoicesTable
			selectedRows={selectedRows}
			invoices={invoiceResponse.invoices ?? []}
			totalPages={invoiceResponse?.totalPages ?? 1}
			isLoading={false}
		/>
	);
}
