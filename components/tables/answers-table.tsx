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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { toast } from '../ui/use-toast';
import { Answer } from '@/db/drizzle/schema/answer';

interface AnswersTableProps {
	answers: Answer[] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function AnswersTable(props: AnswersTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<Answer>[] = [
		{
			accessorKey: 'answer',
			header: 'Answer Text',
			cell: ({ row }) => {
				const answer = row.original;
				return <div className="flex items-center">{answer.answer}</div>;
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Created At',
			enableSorting: true,
			sortDescFirst: true,
			cell: ({ row }) => {
				const answer = row.original;
				return format(new Date(answer.createdAt), 'MMM dd, yyyy');
			},
		},
	];

	const rows: Answer[] | undefined = props.answers;

	return (
		<DataTable
			title="Answers"
			description="List of answers available in the system."
			perPageSelectEnabled={true}
			archivedFilterEnabled={true}
			isLoading={isLoading}
			rowSelectionEnabled={false}
			stickyHeader
			lastColumnSticky
			maxHeight={600}
			columns={columns}
			data={rows}
			search={{ useParams: true }}
			defaultPerPage="100"
			totalPages={props.totalPages}
			id="answers"
		/>
	);
}
