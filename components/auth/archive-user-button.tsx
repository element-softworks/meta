'use client';
import { ExtendedUser } from '@/next-auth';

import { adminArchiveUser } from '@/actions/admin-archive-user';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { useState } from 'react';
import { TableUser } from '../tables/users-table';
import { Button, ButtonProps } from '../ui/button';
import { DialogWrapper } from './dialog-wrapper';
import { User } from '@/db/drizzle/schema/user';

interface ArchiveUserButtonProps {
	user: User | null | TableUser;
}

export function ArchiveUserButton(props: ArchiveUserButtonProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { query: archiveUserQuery, isLoading } = useMutation<ExtendedUser | TableUser, {}>({
		queryFn: async (user) => await adminArchiveUser(props?.user!),
		onCompleted: () => setDialogOpen(false),
	});

	const handleArchiveUser = () => {
		if (!props.user) return;
		archiveUserQuery();
	};

	const currentUser = useCurrentUser();
	if (currentUser?.role !== 'ADMIN') return null;

	const isArchived = !!props.user?.isArchived;
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
				button={
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
				}
				dialog={{
					title,
					description,
					buttonProps,
				}}
			/>
		</div>
	);
}
