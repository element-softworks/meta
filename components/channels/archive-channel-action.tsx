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
import { Channel } from '@/db/drizzle/schema/channel';
import { archiveChannels } from '@/actions/channel/archive-channels';

export function ArchiveChannelAction(
	props: { channel: Channel | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const { query: archiveChannelsQuery, isLoading } = useMutation<{ storeIds: string[] }, {}>({
		queryFn: async (values) => await archiveChannels([props.channel?.id ?? '']),
		onSuccess: () => {},
	});

	const isArchived = !!props.channel?.archivedAt;

	const user = useCurrentUser();

	if (user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<div>
			<Button
				disabled={!props.channel}
				className="w-fit aspect-square"
				size="icon"
				variant={`${isArchived ? 'successful' : 'destructive'}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				{isArchived ? <FaTrashRestore size={16} /> : <Trash size={16} />}
			</Button>

			{!!props.channel ? (
				<DangerConfirmationDialogWrapper
					code={props.channel?.name ?? 'Archive'}
					onSubmit={async () => {
						toast({
							description: isArchived
								? 'Restoring channels...'
								: 'Archiving channels...',
							variant: 'default',
						});
						setOpen(false);

						await archiveChannelsQuery();
					}}
					open={open}
					isLoading={isLoading}
					onOpenChange={onOpenChange}
					dialog={{
						title: isArchived
							? `Restore ${props.channel?.name}`
							: `Archive ${props.channel?.name}`,
						description: isArchived
							? `Are you sure you want to restore ${props.channel?.name}?`
							: `Are you sure you want to archive ${props.channel?.name}? This is a destructive action.`,
						buttonProps: {
							variant: isArchived ? 'successful' : 'destructive',
						},
					}}
				/>
			) : null}
		</div>
	);
}
