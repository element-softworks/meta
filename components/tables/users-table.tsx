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
import { User } from '@prisma/client';
import Image from 'next/image';
import { Avatar } from '../ui/avatar';
import { toast } from '../ui/use-toast';

const columns: ColumnDef<User>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		enableSorting: true,
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
		enableSorting: true,
	},
	{
		accessorKey: 'emailVerified',
		header: 'Email Verified',
		enableSorting: true,
	},
	{
		accessorKey: 'isTwoFactorEnabled',
		header: '2FA',
		enableSorting: true,
	},
	{
		accessorKey: 'role',
		header: 'Role',
		enableSorting: true,
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
						<DropdownMenuItem className="cursor-pointer">View user</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer">
							View user details
						</DropdownMenuItem>
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
