'use client';

import { archiveStores } from '@/actions/store/archive-stores';
import { Policy } from '@/db/drizzle/schema/policy';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { FaTrashRestore } from 'react-icons/fa';
import { DangerConfirmationDialogWrapper } from '../auth/danger-confirmation-dialog-wrapper';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { archivePolicies } from '@/actions/policy/archive-policies';

export function ArchivePolicyAction(
	props: { policy: Policy | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const { query: archivePoliciesQuery, isLoading } = useMutation<{ policyIds: string[] }, {}>({
		queryFn: async (values) => await archivePolicies([props.policy?.id ?? '']),
		onSuccess: () => {},
	});

	const isArchived = !!props.policy?.archivedAt;

	const user = useCurrentUser();

	if (user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<div>
			<Button
				disabled={!props.policy}
				className="w-fit aspect-square"
				size="icon"
				variant={`${isArchived ? 'successful' : 'destructive'}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				{isArchived ? <FaTrashRestore size={16} /> : <Trash size={16} />}
			</Button>

			{!!props.policy ? (
				<DangerConfirmationDialogWrapper
					code={props.policy?.name ?? 'Archive'}
					onSubmit={async () => {
						toast({
							description: isArchived
								? 'Restoring policies...'
								: 'Archiving policies...',
							variant: 'default',
						});
						setOpen(false);

						await archivePoliciesQuery();
					}}
					open={open}
					isLoading={isLoading}
					onOpenChange={onOpenChange}
					dialog={{
						title: isArchived
							? `Restore ${props.policy?.name}`
							: `Archive ${props.policy?.name}`,
						description: isArchived
							? `Are you sure you want to restore ${props.policy?.name}?`
							: `Are you sure you want to archive ${props.policy?.name}? This is a destructive action.`,
						buttonProps: {
							variant: isArchived ? 'successful' : 'destructive',
						},
					}}
				/>
			) : null}
		</div>
	);
}
