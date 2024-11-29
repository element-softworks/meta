'use client';

import { Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Policy } from '@/db/drizzle/schema/policy';
import { PoliciesForm } from './policies-form';
import { PolicyResponse } from '@/actions/policy/get-policy-by-id';

export function EditPolicyAction(
	props: { policy: PolicyResponse } & React.ButtonHTMLAttributes<HTMLButtonElement>
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
			<Button
				disabled={!props.policy}
				className="w-fit aspect-square"
				size="icon"
				variant="default"
				onClick={() => setOpen((prev) => !prev)}
			>
				<Pencil size={16} />
			</Button>

			{!!props.policy ? (
				<FormDrawer
					open={open}
					onOpenChange={onOpenChange}
					title="Update policy"
					description="Update your policies details"
				>
					<PoliciesForm
						isEditing
						editingPolicy={props.policy}
						onComplete={() => {
							setOpen(false);
						}}
					/>
				</FormDrawer>
			) : null}
		</>
	);
}
