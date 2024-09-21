'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { DataTable } from '../data-table';

import { TeamMemberResponse } from '@/actions/get-team-with-members';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TeamMember, User } from '@prisma/client';
import { format } from 'date-fns';
import Image from 'next/image';
import { RemoveUserFromTeamDropdownMenuItem } from '../menu-items/remove-user-from-team-dropdown-menu-item';
import { Avatar } from '../ui/avatar';
import { toast } from '../ui/use-toast';

export type TableTeamsMember = {
	id: string;
	name: string;
	createdAt: Date;
	createdBy: string;
	image: string;
	isArchived: boolean;
	updatedAt: Date;
	members: (TeamMember & { user: User })[];
};

interface TeamsMemberTableProps {
	teamMembers?: TeamMemberResponse | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function TeamsMemberTable(props: TeamsMemberTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<TeamMemberResponse[0]['member'] | undefined>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				console.log(row.original, 'row.original');
				const member = row.original;
				return (
					<div className="flex items-center">
						{!!member?.user?.image ? (
							<Avatar className="size-7">
								<Image
									width={35}
									height={35}
									src={member?.user?.image}
									alt="team avatar"
								/>
							</Avatar>
						) : null}
						<div className="ml-2">{member?.user?.name}</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => {
				const member = row.original;
				return member?.user?.email;
			},
		},
		{
			accessorKey: 'role',
			header: 'Team role',
			cell: ({ row }) => {
				const member = row.original;

				const role = member?.role?.toLocaleLowerCase();
				const uppercaseRole = role && role?.charAt?.(0)?.toUpperCase?.() + role?.slice?.(1);
				return uppercaseRole;
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Joined at',
			sortDescFirst: true,
			enableSorting: true,
			cell: ({ row }) => {
				const member = row.original;
				return format(new Date(member?.createdAt ?? Date.now()), 'MMM d, yyyy');
			},
		},

		{
			id: 'actions',
			cell: ({ row }) => {
				const member = row.original;
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
									navigator.clipboard.writeText(member?.userId ?? '');
									toast({
										description: 'User ID copied to clipboard',
									});
								}}
							>
								Copy members ID
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<RemoveUserFromTeamDropdownMenuItem
								teamMembers={props.teamMembers ?? []}
								teamId={member?.teamId ?? ''}
								userId={member?.userId ?? ''}
							/>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: TeamMemberResponse[0]['member'][] | undefined = props.teamMembers?.map?.(
		(teamMember) => ({
			role: teamMember.member.role,
			teamId: teamMember.member.teamId,
			userId: teamMember.member.userId,
			user: teamMember.member.user,
			createdAt: teamMember.member.createdAt,
			updatedAt: teamMember.member.updatedAt,
		})
	);

	return (
		<DataTable
			title="Team Members"
			description="View and manage your team members"
			perPageSelectEnabled={true}
			archivedFilterEnabled={true}
			isLoading={isLoading}
			rowSelectionEnabled={false}
			stickyHeader
			lastColumnSticky
			maxHeight={500}
			columns={columns}
			data={rows}
			search={{ useParams: true }}
			totalPages={props.totalPages}
			id="team-members"
		/>
	);
}
