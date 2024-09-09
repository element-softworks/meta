'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DataTable } from '../data-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Team, TeamMember, TeamRole, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { AvatarGroup } from '../avatar-group';
import { ArchiveTeamDropdownMenuItem } from '../menu-items/archive-team-dropdown-menu-item';
import { Avatar } from '../ui/avatar';
import { toast } from '../ui/use-toast';

export type TableTeam = {
	id: string;
	name: string;
	createdAt: Date;
	createdBy: string;
	image: string;
	isArchived: boolean;
	updatedAt: Date;
	members: (TeamMember & { user: User })[];
};

interface TeamsTableProps {
	teams: {
		teamId: string;
		userId: string;
		role: TeamRole;
		team: Team & {
			members: any;
		};
		user: User;
	}[];
	totalPages: number | undefined;
	isLoading: boolean;
}

export function TeamsTable(props: TeamsTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<TableTeam>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			enableSorting: true,
			cell: ({ row }) => {
				const team = row.original;
				return (
					<div className="flex items-center">
						{!!team?.image ? (
							<Avatar className="size-7">
								<Image width={35} height={35} src={team?.image} alt="team avatar" />
							</Avatar>
						) : null}
						<div className="ml-2">{team.name}</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'createdBy',
			header: 'Owner',
			enableSorting: true,
		},
		{
			accessorKey: 'members',
			header: 'Members',
			cell: ({ row }) => {
				const team = row.original;
				return (
					<AvatarGroup
						maxSize={4}
						avatars={team.members.map((member) => ({
							src: member.user.image ?? '',
							alt: member.user.name ?? '',
						}))}
					/>
				);
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Created on',
			enableSorting: true,
			cell: ({ row }) => {
				const team = row.original;
				return format(new Date(team.createdAt), 'MMM d, yyyy');
			},
		},
		{
			accessorKey: 'updatedAt',
			header: 'Last updated',
			enableSorting: true,
			cell: ({ row }) => {
				const team = row.original;
				return format(new Date(team.updatedAt), 'MMM d, yyyy');
			},
		},

		{
			id: 'actions',
			cell: ({ row }) => {
				const team = row.original;
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
									navigator.clipboard.writeText(team?.id ?? '');
									toast({
										description: 'Team ID copied to clipboard',
									});
								}}
							>
								Copy team ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Link href={`/dashboard/teams/${team.id}`}>
								<DropdownMenuItem className="cursor-pointer">
									View team
								</DropdownMenuItem>
							</Link>
							<ArchiveTeamDropdownMenuItem team={team} />
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: TableTeam[] | undefined = props.teams?.map((teamMember) => ({
		id: teamMember.teamId,
		name: teamMember.team.name,
		createdAt: teamMember.team.createdAt,
		createdBy: teamMember.team.createdBy,
		image: teamMember.team.image ?? '',
		isArchived: teamMember.team.isArchived,
		updatedAt: teamMember.team.updatedAt,
		members: teamMember.team.members,
	}));

	return (
		<DataTable
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
			id="teams"
		/>
	);
}
