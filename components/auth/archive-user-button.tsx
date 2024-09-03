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

interface ArchiveUserButtonProps {
	user: ExtendedUser | null | TableUser;
}

export function ArchiveUserButton(props: ArchiveUserButtonProps) {
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

	const isArchived = props.user?.isArchived ?? false;

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
		<div className="flex gap-2 flex-col">
			<div>
				<p className="text-lg font-bold">{isArchived ? 'Restore' : 'Archive'} account</p>
				<p className="text-muted-foreground text-sm">
					{isArchived
						? 'Restoring a user will enact their access to the system'
						: 'Archiving a user will revoke their access to the system'}
				</p>
			</div>

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
				<Button
					onClick={() => {
						setDialogOpen(true);
					}}
					disabled={isLoading}
					isLoading={isLoading}
					className="w-fit"
					variant={isArchived ? 'successful' : 'destructive'}
				>
					{isArchived ? 'Restore' : 'Archive'} User
				</Button>
			</DialogWrapper>
		</div>
	);
}