'use client';

import { Question } from '@/db/drizzle/schema/question';
import { Store } from '@/db/drizzle/schema/store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { PoliciesForm } from './policies-form';

export function CreatePolicyAction(
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
					Create policy
				</Button>
			)}

			<FormDrawer
				title="Create policy"
				description="Create a policy group"
				open={open}
				onOpenChange={onOpenChange}
			>
				<PoliciesForm
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
