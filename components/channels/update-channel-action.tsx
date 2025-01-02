'use client';

import { ChannelsResponse } from '@/actions/channel/get-channels';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Pen } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { ChannelForm } from './form/channel-form';

export function UpdateChannelAction(
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		button?: React.ReactNode;
		channel?: ChannelsResponse['channels'][0];
	}
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	const user = useCurrentUser();

	if (user?.role !== 'ADMIN') {
		return null;
	}

	return (
		<>
			{props.button ? (
				<div onClick={() => setOpen((prev) => !prev)}>{props.button}</div>
			) : (
				<Button
					{...props}
					disabled={!props.channel}
					className="w-fit aspect-square"
					size="icon"
					onClick={() => setOpen((prev) => !prev)}
				>
					<Pen />
				</Button>
			)}

			<FormDrawer
				title="Update channel"
				description="A channel is retailer groupings for stores."
				open={open}
				onOpenChange={onOpenChange}
			>
				<ChannelForm
					channel={props.channel}
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
