'use client';

import { archiveFixtureTypes } from '@/actions/fixture-type/archive-fixture-types';
import { FixtureType } from '@/db/drizzle/schema/fixtureType';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useMutation } from '@/hooks/use-mutation';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { FaTrashRestore } from 'react-icons/fa';
import { DangerConfirmationDialogWrapper } from '../auth/danger-confirmation-dialog-wrapper';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

export function ArchiveFixtureTypeAction(
	props: { fixtureType: FixtureType | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const { query: archiveFixtureTypesQuery, isLoading } = useMutation<{ storeIds: string[] }, {}>({
		queryFn: async (values) => await archiveFixtureTypes([props.fixtureType?.id ?? '']),
		onSuccess: () => {},
	});

	const isArchived = !!props.fixtureType?.archivedAt;

	const user = useCurrentUser();

	if (user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<div>
			<Button
				disabled={!props.fixtureType}
				className="w-fit aspect-square"
				size="icon"
				variant={`${isArchived ? 'successful' : 'destructive'}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				{isArchived ? <FaTrashRestore size={16} /> : <Trash size={16} />}
			</Button>

			{!!props.fixtureType ? (
				<DangerConfirmationDialogWrapper
					code={props.fixtureType?.name ?? 'Archive'}
					onSubmit={async () => {
						toast({
							description: isArchived
								? 'Restoring fixture types...'
								: 'Archiving fixture types...',
							variant: 'default',
						});
						setOpen(false);

						await archiveFixtureTypesQuery();
					}}
					open={open}
					isLoading={isLoading}
					onOpenChange={onOpenChange}
					dialog={{
						title: isArchived
							? `Restore ${props.fixtureType?.name}`
							: `Archive ${props.fixtureType?.name}`,
						description: isArchived
							? `Are you sure you want to restore ${props.fixtureType?.name}?`
							: `Are you sure you want to archive ${props.fixtureType?.name}? This is a destructive action.`,
						buttonProps: {
							variant: isArchived ? 'successful' : 'destructive',
						},
					}}
				/>
			) : null}
		</div>
	);
}
