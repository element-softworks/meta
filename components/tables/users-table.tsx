'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { DataTable } from '../general/data-table';

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
import { Account } from '@/db/drizzle/schema/account';
import { User } from '@/db/drizzle/schema/user';
import { Badge } from '../ui/badge';

export type TableUser = {
	id: string;
	name: string;
	email: string;
	role: 'ADMIN' | 'USER';
	isTwoFactorEnabled: 'Enabled' | 'Disabled';
	emailVerified: string;
	provider: string;
	createdAt: Date;
	image: string;
	isArchived?: boolean;
	lastLogin: Date | null;
};

interface UsersTableProps {
	users: { user: User; provider: Account | null }[] | undefined;
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
			accessorKey: 'provider',
			header: 'Provider',
			enableSorting: true,
			sortDescFirst: true,
			cell: ({ row }) => {
				const user = row.original;
				let logo = '';

				if (user.provider === 'google') {
					logo =
						'https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png';
				} else if (user.provider === 'github') {
					logo = 'https://cdn-icons-png.flaticon.com/512/25/25231.png';
				}

				return (
					<div className="flex gap-1 items-center">
						{!!logo ? (
							<Image width={25} height={25} src={logo} alt="provider logo" />
						) : (
							<p className="">{user.provider}</p>
						)}
					</div>
				);
			},
		},

		{
			accessorKey: 'isTwoFactorEnabled',
			header: '2FA',
			cell: ({ row }) => {
				const user = row.original;
				return user?.isTwoFactorEnabled === 'Enabled' ? (
					<Check className="text-successful" />
				) : (
					<X className="text-destructive" />
				);
			},
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) => {
				const user = row.original;
				return <Badge>{user.role}</Badge>;
			},
		},
		{
			accessorKey: 'emailVerified',
			header: 'Email Verified',
		},
		{
			accessorKey: 'lastLogin',
			header: 'Last login',
			cell: ({ row }) => {
				const user = row.original;
				return !!user?.lastLogin
					? format(new Date(user.lastLogin), 'MMM dd, yyyy')
					: 'Never';
			},
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

	const rows: TableUser[] | undefined = props.users?.map((response) => ({
		id: response.user.id,
		name: response.user.name ?? 'User',
		email: response.user.email,
		role: response.user.role,
		isTwoFactorEnabled: response.user.isTwoFactorEnabled ? 'Enabled' : 'Disabled',
		emailVerified: !!response.user.emailVerified
			? format(new Date(response.user.emailVerified), 'MMM dd, yyyy')
			: 'Not verified',
		createdAt: response.user.createdAt,
		lastLogin: response.user.lastLogin,
		image: response.user.image ?? '',
		isArchived: response.user.isArchived,
		provider: response?.provider?.provider ?? 'Credentials',
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
