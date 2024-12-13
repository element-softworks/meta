'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowRight } from 'lucide-react';
import { DataTable } from '../general/data-table';

import { Button } from '@/components/ui/button';
import { Question } from '@/db/drizzle/schema/question';
import Link from 'next/link';
import { PolicyQuestionsResponse } from '@/actions/policy/get-policy-questions';

interface PolicyQuestionsTableProps {
	questions: PolicyQuestionsResponse['questions'] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function PolicyQuestionsTable(props: PolicyQuestionsTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<PolicyQuestionsResponse['questions'][0]>[] = [
		{
			accessorKey: 'category',
			header: 'Category',
			cell: ({ row }) => {
				const data = row.original;
				return <div className="flex items-center">{data?.question?.category}</div>;
			},
		},
		{
			accessorKey: 'question',
			header: 'Question Text',
			cell: ({ row }) => {
				const data = row.original;
				return <div className="flex items-center">{data?.question?.questionText}</div>;
			},
		},

		{
			id: 'actions',
			cell: ({ row }) => {
				const data = row.original;
				return (
					<Link
						className="text-foreground"
						href={`/dashboard/question-and-answers/questions/${data?.question?.id}`}
					>
						<Button size="icon" variant="ghost">
							<ArrowRight size={16} />
						</Button>
					</Link>
				);
			},
		},
	];

	const rows: PolicyQuestionsResponse['questions'] | undefined = props.questions;

	return (
		<DataTable
			title={'Questions'}
			description={'List of questions associated with this policy'}
			perPageSelectEnabled={true}
			archivedFilterEnabled={true}
			columnVisibilityEnabled={true}
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
