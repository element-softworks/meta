'use client';

import { Store } from '@/db/drizzle/schema/store';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { DangerConfirmationDialogWrapper } from '../auth/danger-confirmation-dialog-wrapper';
import { Button } from '../ui/button';
import { useMutation } from '@/hooks/use-mutation';
import { archiveStores } from '@/actions/store/archive-stores';
import { FaTrashRestore } from 'react-icons/fa';
import { toast } from '../ui/use-toast';

export function ArchiveStoreAction(
	props: { store: Store | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const { query: archiveStoresQuery, isLoading } = useMutation<{ storeIds: string[] }, {}>({
		queryFn: async (values) => await archiveStores([props.store?.id ?? '']),
		onSuccess: () => {},
	});

	const isArchived = !!props.store?.archivedAt;

	return (
		<div>
			<Button
				disabled={!props.store}
				className="w-fit aspect-square"
				size="icon"
				variant={`${isArchived ? 'successful' : 'destructive'}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				{isArchived ? <FaTrashRestore size={16} /> : <Trash size={16} />}
			</Button>

			{!!props.store ? (
				<DangerConfirmationDialogWrapper
					code={props.store?.name ?? 'Archive'}
					onSubmit={async () => {
						toast({
							description: isArchived ? 'Restoring store...' : 'Archiving stores...',
							variant: 'default',
						});
						setOpen(false);

						await archiveStoresQuery();
					}}
					open={open}
					isLoading={isLoading}
					onOpenChange={onOpenChange}
					dialog={{
						title: isArchived
							? `Restore ${props.store?.name}`
							: `Archive ${props.store?.name}`,
						description: isArchived
							? `Are you sure you want to restore ${props.store?.name}?`
							: `Are you sure you want to archive ${props.store?.name}? This is a destructive action.`,
						buttonProps: {
							variant: isArchived ? 'successful' : 'destructive',
						},
					}}
				/>
			) : null}
		</div>
	);
}
