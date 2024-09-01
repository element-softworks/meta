'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
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
import { User } from '@prisma/client';
import Image from 'next/image';
import { Avatar } from '../ui/avatar';

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
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
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'emailVerified',
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Email verified
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'isTwoFactorEnabled',
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					2FA
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'role',
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Role
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					className="px-0"
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Joined on
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
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
							onClick={() => navigator.clipboard.writeText(user?.id ?? '')}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View user</DropdownMenuItem>
						<DropdownMenuItem>View user details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

interface UsersTableProps {
	users: User[] | undefined;
	totalPages: number | undefined;
}

export function UsersTable(props: UsersTableProps) {
	const rows: any = props.users?.map((user) => ({
		...user,
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role === 'ADMIN' ? 'Admin' : 'User',
		isTwoFactorEnabled: user.isTwoFactorEnabled ? 'Enabled' : 'Disabled',
		emailVerified: !!user.emailVerified
			? format(new Date(user.emailVerified), 'MMM dd, yyyy')
			: 'Not verified',
	}));

	return (
		<DataTable
			rowSelectionEnabled={false}
			lastColumnSticky
			maxHeight={500}
			columns={columns}
			data={rows}
			filterColumn={{ useParams: true }}
			totalPages={props.totalPages}
			id="users"
		/>
	);
}
