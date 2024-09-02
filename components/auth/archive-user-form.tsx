'use client';
import { ExtendedUser } from '@/next-auth';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { adminArchiveUser } from '@/actions/admin-archive-user';
import { useMutation } from '@/hooks/use-mutation';
import { useState } from 'react';
import { TableUser } from '../tables/users-table';

interface ArchiveUserFormProps {
	user: ExtendedUser | null | TableUser;
	disableButton?: boolean;
	children?: React.ReactNode;
}

export function ArchiveUserForm(props: ArchiveUserFormProps) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { query: archiveUserQuery, isLoading } = useMutation<ExtendedUser | TableUser, {}>({
		queryFn: async (user) => await adminArchiveUser(user!),
		onCompleted: () => setDialogOpen(false),
	});

	const handleArchiveUser = () => {
		if (!props.user) return;
		archiveUserQuery(props.user);
	};

	const isArchived = props.user?.isArchived ?? false;
	return (
		<div className="flex gap-2 flex-col">
			{props.disableButton ? null : (
				<div>
					<p className="text-lg font-bold">
						{isArchived ? 'Restore' : 'Archive'} account
					</p>
					<p className="text-muted-foreground text-sm">
						{isArchived
							? 'Restoring a user will enact their access to the system'
							: 'Archiving a user will revoke their access to the system'}
					</p>
				</div>
			)}

			<Dialog open={dialogOpen} onOpenChange={(state) => setDialogOpen(state)}>
				{props.disableButton ? null : (
					<Button
						onClick={() => setDialogOpen(true)}
						disabled={isLoading}
						isLoading={isLoading}
						className="w-fit"
						variant={isArchived ? 'default' : 'destructive'}
					>
						{isArchived ? 'Restore' : 'Archive'} User
					</Button>
				)}
				<DialogTrigger>{props.children}</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{isArchived ? 'Restore' : 'Archive'} {props.user?.name}
						</DialogTitle>
						<DialogDescription>
							{isArchived
								? `Restoring ${
										props.user?.name ?? 'this user'
								  } will grant them access to the system. This action can only be undone by a site administrator`
								: `Archiving ${
										props.user?.name ?? 'this user'
								  } will remove them from the system and revoke their access. This action can only be undone by a site administrator`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setDialogOpen(false)} variant="secondary">
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							isLoading={isLoading}
							onClick={() => handleArchiveUser()}
							variant={isArchived ? 'default' : 'destructive'}
							type="submit"
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
