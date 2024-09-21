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
import Image from 'next/image';
import Link from 'next/link';
import { ArchiveUserDropdownMenuItem } from '../auth/archive-user-dropdown-menu-item';
import { Avatar } from '../ui/avatar';
import { toast } from '../ui/use-toast';
import { User } from '@/db/drizzle/schema/user';

export type TableUser = {
	id: string;
	name: string;
	email: string;
	role: 'Admin' | 'User';
	isTwoFactorEnabled: 'Enabled' | 'Disabled';
	emailVerified: string;

	createdAt: Date;
	image: string;
	isArchived?: boolean;
};

interface UsersTableProps {
	users: User[] | undefined;
	totalPages: number | undefined;
	isLoading: boolean;
}

export function UsersTable(props: UsersTableProps) {
	const { isLoading = false } = props;
	const columns: ColumnDef<TableUser>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center">
						{!!user?.image ? (
							<Avatar className="size-7">
								<Image width={35} height={35} src={user?.image} alt="user avatar" />
							</Avatar>
						) : null}
						<div className="ml-2">{user.name}</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'emailVerified',
			header: 'Email Verified',
		},
		{
			accessorKey: 'isTwoFactorEnabled',
			header: '2FA',
			cell: ({ row }) => {
				const user = row.original;
				return user.isTwoFactorEnabled;
			},
		},
		{
			accessorKey: 'role',
			header: 'Role',
		},
		{
			accessorKey: 'createdAt',
			header: 'Joined on',
			enableSorting: true,
			sortDescFirst: true,
			cell: ({ row }) => {
				const user = row.original;
				return format(new Date(user.createdAt), 'MMM dd, yyyy');
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original;
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
									navigator.clipboard.writeText(user?.id ?? '');
									toast({
										description: 'User ID copied to clipboard',
									});
								}}
							>
								Copy user ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Link href={`/dashboard/admin/users/${user.id}`}>
								<DropdownMenuItem className="cursor-pointer">
									View user
								</DropdownMenuItem>
							</Link>
							<ArchiveUserDropdownMenuItem user={user} />
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const rows: TableUser[] | undefined = props.users?.map((user) => ({
		id: user.id,
		name: user.name ?? 'User',
		email: user.email,
		role: user.role === 'ADMIN' ? 'Admin' : 'User',
		isTwoFactorEnabled: user.isTwoFactorEnabled ? 'Enabled' : 'Disabled',
		emailVerified: !!user.emailVerified
			? format(new Date(user.emailVerified), 'MMM dd, yyyy')
			: 'Not verified',
		createdAt: user.createdAt,
		image: user.image ?? '',
		isArchived: user.isArchived,
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
			id="users"
		/>
	);
}
