'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { ChannelForm } from './form/channel-form';

export function CreateChannelAction(
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		button?: React.ReactNode;
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
					className="w-fit aspect-square"
					size="icon"
					onClick={() => setOpen((prev) => !prev)}
				>
					<Plus />
				</Button>
			)}

			<FormDrawer
				title="Create channel"
				description="A channel is retailer groupings for stores."
				open={open}
				onOpenChange={onOpenChange}
			>
				<ChannelForm
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
