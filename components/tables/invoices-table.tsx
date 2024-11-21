'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DataTable } from '../general/data-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CustomerInvoice } from '@/db/drizzle/schema/customerInvoice';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';

export type InvoicesTable = CustomerInvoice;

interface InvoicesTableProps {
	invoices: CustomerInvoice[];
	totalPages: number | undefined;
	isLoading: boolean;
	selectedRows: string[];
}

export function InvoicesTable(props: InvoicesTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<InvoicesTable>[] = [
		{
			accessorKey: 'id',
			header: 'Order number',
		},
		{
			accessorKey: 'createdAt',
			header: 'Date',
			enableSorting: true,

			cell: ({ row }) => {
				const invoice = row.original;
				return format(new Date(invoice.createdAt), 'MMM d, yyyy h:mm a');
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const invoice = row.original;
				const badgeColor = invoice.status === 'succeeded' ? 'successful' : 'destructive';
				return <Badge variant={badgeColor}>{invoice.status}</Badge>;
			},
		},
		{
			accessorKey: 'currency',
			header: 'Currency',
		},
		{
			accessorKey: 'total',
			header: 'Total amount',
			cell: ({ row }) => {
				const invoice = row.original;
				return `${invoice.total / 100}`;
			},
		},

		{
			id: 'actions',
			cell: ({ row }) => {
				const invoice = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							{!!invoice?.invoicePdf ? (
								<a href={`${invoice?.invoicePdf}`}>
									<DropdownMenuItem className="cursor-pointer">
										Download
									</DropdownMenuItem>
								</a>
							) : null}

							{!!invoice?.invoicePdf ? (
								<a
									href={`${invoice?.invoicePdf?.split('/pdf')[0]}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<DropdownMenuItem className="cursor-pointer">
										View invoice
									</DropdownMenuItem>
								</a>
							) : null}

							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(invoice?.id ?? '');
									toast({
										description: 'Invoice ID copied to clipboard',
									});
								}}
							>
								Copy invoice ID
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: InvoicesTable[] | undefined = props.invoices;

	return (
		<div>
			<DataTable
				perPageSelectEnabled={true}
				isLoading={isLoading}
				stickyHeader
				rowSelectionEnabled={false}
				lastColumnSticky
				maxHeight={800}
				columns={columns}
				data={rows}
				search={{ useParams: true }}
				totalPages={props.totalPages}
				id="invoices"
			/>
		</div>
	);
}
