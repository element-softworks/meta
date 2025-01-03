'use client';

import { Plus } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Button } from '../ui/button';
import FormDrawer from '../general/form-drawer';
import { StoresForm } from './form/stores-form';
import { useCurrentUser } from '@/hooks/use-current-user';

export function CreateStoreAction(
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

			<FormDrawer open={open} onOpenChange={onOpenChange}>
				<StoresForm
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
