'use client';

import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { Store } from '@/db/drizzle/schema/store';
import { StoresForm } from './form/stores-form';

export function EditStoreAction(
	props: { store: Store | undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	return (
		<>
			<Button
				disabled={!props.store}
				className="w-fit aspect-square"
				size="icon"
				variant="default"
				onClick={() => setOpen((prev) => !prev)}
			>
				<Pencil size={16} />
			</Button>

			{!!props.store ? (
				<FormDrawer open={open} onOpenChange={onOpenChange}>
					<StoresForm
						isEditing
						editingStore={props.store}
						onComplete={() => {
							setOpen(false);
						}}
					/>
				</FormDrawer>
			) : null}
		</>
	);
}
