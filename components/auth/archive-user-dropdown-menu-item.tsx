'use client';
import { ExtendedUser } from '@/next-auth';

import { adminArchiveUser } from '@/actions/admin-archive-user';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { UserRole } from '@prisma/client';
import { useState } from 'react';
import { TableUser } from '../tables/users-table';
import { Button, ButtonProps } from '../ui/button';
import { DialogWrapper } from './dialog-wrapper';
import { DropdownMenuItem } from '../ui/dropdown-menu';

interface ArchiveUserDropdownMenuItemProps {
	user: ExtendedUser | null | TableUser;
}

export function ArchiveUserDropdownMenuItem(props: ArchiveUserDropdownMenuItemProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { query: archiveUserQuery, isLoading } = useMutation<ExtendedUser | TableUser, {}>({
		queryFn: async (user) => await adminArchiveUser(user!),
		onCompleted: () => setDialogOpen(false),
	});

	const handleArchiveUser = () => {
		if (!props.user) return;
		archiveUserQuery(props.user);
	};

	const currentUser = useCurrentUser();
	if (currentUser?.role !== UserRole.ADMIN) return null;

	const isArchived = !!props.user?.isArchived ?? false;

	const title = isArchived ? 'Restore' : 'Archive';
	const description = isArchived
		? `Restoring ${props.user?.name ?? 'this user'}
		will grant them access to the system. This action can only be undone by a site administrator`
		: `Archiving ${props.user?.name ?? 'this user'}
		will remove them from the system and revoke their access. This action can only be undone by a site administrator`;
	const buttonProps: ButtonProps = isArchived
		? { variant: 'successful' }
		: { variant: 'destructive' };

	return (
		<DialogWrapper
			isLoading={isLoading}
			onOpenChange={(state) => setDialogOpen(state)}
			open={dialogOpen}
			onSubmit={() => handleArchiveUser()}
			dialog={{
				title,
				description,
				buttonProps,
			}}
		>
			<DropdownMenuItem
				onClick={(e) => {
					e.preventDefault();
					setDialogOpen(true);
				}}
				className="cursor-pointer"
			>
				{isArchived ? 'Restore' : 'Archive'} User
			</DropdownMenuItem>
		</DialogWrapper>
	);
}
