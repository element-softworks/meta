'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../general/data-table';

import { TeamMemberResponse } from '@/actions/team/get-team-with-members';
import { ConciergeToken } from '@/db/drizzle/schema/conciergeToken';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

interface InvitedTeamsMemberTableProps {
	teamMembers?: ConciergeToken[] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function InvitedTeamsMemberTable(props: InvitedTeamsMemberTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<ConciergeToken | undefined>[] = [
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'role',
			header: 'Team role',
			cell: ({ row }) => {
				const member = row.original;

				const role = member?.role?.toLocaleLowerCase();
				const uppercaseRole = role && role?.charAt?.(0)?.toUpperCase?.() + role?.slice?.(1);
				return <Badge>{uppercaseRole}</Badge>;
			},
		},
		{
			accessorKey: 'expiresAt',
			header: 'Invite expires on',
			cell: ({ row }) => {
				const member = row.original;
				return format(new Date(member?.expiresAt ?? Date.now()), 'MMM d, yyyy');
			},
		},
	];

	const rows: ConciergeToken[] | undefined = props.teamMembers;

	return (
		<DataTable
			perPageSelectEnabled={true}
			archivedFilterEnabled={false}
			isLoading={isLoading}
			rowSelectionEnabled={false}
			stickyHeader
			maxHeight={500}
			columns={columns}
			data={rows}
			search={{ useParams: true }}
			totalPages={props.totalPages}
			id="invited-team-members"
		/>
	);
}
