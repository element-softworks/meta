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
import { Question } from '@/db/drizzle/schema/question';
import Link from 'next/link';
import { toast } from '../ui/use-toast';

interface QuestionsTableProps {
	questions: Question[] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function QuestionsTable(props: QuestionsTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<Question>[] = [
		{
			accessorKey: 'category',
			header: 'Category',
			cell: ({ row }) => {
				const question = row.original;
				return <div className="flex items-center">{question.category}</div>;
			},
		},
		{
			accessorKey: 'question',
			header: 'Question Text',
			cell: ({ row }) => {
				const question = row.original;
				return <div className="flex items-center">{question.questionText}</div>;
			},
		},

		{
			accessorKey: 'note',
			header: 'Note',
			cell: ({ row }) => {
				const question = row.original;
				return <div className="flex items-center">{question.note}</div>;
			},
		},

		{
			accessorKey: 'fixtureRelated',
			header: 'Fixture Related',
			cell: ({ row }) => {
				const question = row.original;
				return <div className="flex items-center">{question.fixtureRelated}</div>;
			},
		},

		{
			accessorKey: 'labels',
			header: 'Labels',
			cell: ({ row }) => {
				const question = row.original;
				return <div className="flex items-center">{question.labels}</div>;
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const question = row.original;
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
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									navigator.clipboard.writeText(question?.id ?? '');
									toast({
										description: 'Question ID copied to clipboard',
									});
								}}
							>
								Copy question ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Link
								href={`/dashboard/admin/question-and-answers/questions/${question.id}`}
							>
								<DropdownMenuItem className="cursor-pointer">
									View question
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: Question[] | undefined = props.questions;

	return (
		<DataTable
			title="Questions"
			description="List of questions available in the system."
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
			id="questions"
		/>
	);
}
