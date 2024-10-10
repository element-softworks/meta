'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { DataTable } from '../data-table';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from '../ui/use-toast';
import { Team } from '@/db/drizzle/schema/team';
import { User } from '@/db/drizzle/schema/user';
import { Avatar } from '../ui/avatar';
import Image from 'next/image';
import { TeamMember } from '@/db/drizzle/schema/teamMember';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';
import { ArchiveTeamDropdownMenuItem } from '../menu-items/archive-team-dropdown-menu-item';
import { AvatarGroup } from '../avatar-group';

export type TeamsTable = {
	team: Team & {
		createdBy: {
			id: string;
			email: string;
			name: string;
			image: string;
		};
		users: User[];
	};
};

interface TeamsTableProps {
	admin: boolean;
	teams: TeamsTable[];
	totalPages: number | undefined;
	isLoading: boolean;
}

export function TeamsTable(props: TeamsTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<TeamsTable>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				const teamResponse = row.original;
				return (
					<div className="flex items-center">
						{!!teamResponse?.team?.image ? (
							<Avatar className="size-7">
								<Image
									width={35}
									height={35}
									src={teamResponse?.team?.image}
									alt="user avatar"
								/>
							</Avatar>
						) : null}
						<div className="ml-2">{teamResponse?.team?.name}</div>
					</div>
				);
			},
		},

		{
			accessorKey: 'owner',
			header: 'Owner',
			cell: ({ row }) => {
				const teamResponse = row.original;
				return (
					<div className="flex items-center">
						{!!teamResponse?.team?.createdBy?.image ? (
							<Avatar className="size-7">
								<Image
									width={35}
									height={35}
									src={teamResponse?.team?.createdBy?.image}
									alt="user avatar"
								/>
							</Avatar>
						) : null}
						<div className="ml-2">{teamResponse?.team?.createdBy?.name}</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'members',
			header: 'Members',
			cell: ({ row }) => {
				const teamResponse = row.original;
				return (
					<AvatarGroup
						avatars={
							teamResponse?.team?.users?.map?.((member) => ({
								alt: member?.name ?? '',
								src: member?.image ?? '',
							})) ?? []
						}
					/>
				);
			},
		},

		{
			accessorKey: 'archived',
			header: 'Archived',
			cell: ({ row }) => {
				const teamResponse = row.original;
				return !!teamResponse?.team?.isArchived ? (
					<Check className="text-successful" />
				) : (
					<X className="text-destructive" />
				);
			},
		},
		{
			accessorKey: 'customer',
			header: 'Paying customer',
			cell: ({ row }) => {
				const teamResponse = row.original;
				return !!teamResponse?.team?.stripeCustomerId?.length ? (
					<Check className="text-successful" />
				) : (
					<X className="text-destructive" />
				);
			},
		},
		{
			accessorKey: 'createdAt',
			header: 'Created at',
			enableSorting: true,

			cell: ({ row }) => {
				const teamResponse = row.original;
				return (
					<div>
						{format(new Date(teamResponse?.team?.createdAt), 'MMM d, yyyy h:mm a')}
					</div>
				);
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
									navigator.clipboard.writeText(team?.team?.id ?? '');
									toast({
										description: 'Team ID copied to clipboard',
									});
								}}
							>
								Copy team ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Link href={`/dashboard/teams/${team?.team?.id}`}>
								<DropdownMenuItem className="cursor-pointer">
									View team
								</DropdownMenuItem>
							</Link>

							<Link href={`/dashboard/teams/${team?.team?.id}/edit`}>
								<DropdownMenuItem className="cursor-pointer">
									Edit team
								</DropdownMenuItem>
							</Link>

							<ArchiveTeamDropdownMenuItem visible={props.admin} team={team?.team} />
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: TeamsTable[] | undefined = props.teams;

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
				id="teams"
			/>
		</div>
	);
}
