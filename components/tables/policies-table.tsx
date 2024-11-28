'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../general/data-table';
import { Question } from '@/db/drizzle/schema/question';
import { CreatePolicyAction } from '../policies/create-policy-action';

interface PoliciesTableProps {
	policies: Question[] | undefined;
	totalPages: number | undefined;
	totalPolicies: number;
	isLoading: boolean;
}

export function PoliciesTable(props: PoliciesTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<Question>[] = [
		{
			accessorKey: 'name',
			header: 'Policy name',
			cell: ({ row }) => {
				const policy = row.original;
				return <div className="flex items-center">{policy?.name}</div>;
			},
		},

		{
			accessorKey: 'counties',
			header: 'Countries',
			cell: ({ row }) => {
				const policy = row.original;
				return <div className="flex items-center">{policy?.countries}</div>;
			},
		},
	];

	const rows: Question[] | undefined = props.policies;

	return (
		<DataTable
			actions={<CreatePolicyAction />}
			title="Policies"
			description={`Displaying ${rows?.length}/${props.totalPolicies} policies`}
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
			id="policies"
		/>
	);
}
