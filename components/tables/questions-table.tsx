'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { DataTable } from '../general/data-table';

import { Button } from '@/components/ui/button';
import { Question } from '@/db/drizzle/schema/question';
import Link from 'next/link';

interface QuestionsTableProps {
	questions: Question[] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
	disableActions?: boolean;
	title?: string;
	description?: string;
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
					<Link
						className="text-foreground"
						href={`/dashboard/question-and-answers/questions/${question.id}`}
					>
						<Button size="icon" variant="ghost">
							<ArrowRight size={16} />
						</Button>
					</Link>
				);
			},
		},
	];

	const rows: Question[] | undefined = props.questions;

	return (
		<DataTable
			title={props.title ?? 'Questions'}
			description={props.description ?? 'List of questions available in the system.'}
			perPageSelectEnabled={props.disableActions ? false : true}
			archivedFilterEnabled={props.disableActions ? false : true}
			columnVisibilityEnabled={props.disableActions ? false : true}
			isLoading={isLoading}
			rowSelectionEnabled={false}
			stickyHeader
			lastColumnSticky
			maxHeight={600}
			columns={columns}
			data={rows}
			search={props.disableActions ? '' : { useParams: true }}
			defaultPerPage="100"
			totalPages={props.totalPages}
			id="questions"
		/>
	);
}
