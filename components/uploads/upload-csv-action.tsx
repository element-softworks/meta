'use client';

import { Question } from '@/db/drizzle/schema/question';
import { Store } from '@/db/drizzle/schema/store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { PoliciesForm } from '../policies/policies-form';
import { CSVForm } from './csv-form';

export function UploadCSVAction(
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
				<Button className="w-fit aspect-square" onClick={() => setOpen((prev) => !prev)}>
					<Plus size={16} className="mr-1" />
					Upload CSV
				</Button>
			)}

			<FormDrawer
				title="Upload CSV"
				description="Upload an assessment CSV"
				open={open}
				onOpenChange={onOpenChange}
			>
				<></>
				<CSVForm
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
