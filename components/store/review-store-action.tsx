'use client';

import { StoreResponse } from '@/actions/store/get-store-by-id';
import { FolderOpenDot } from 'lucide-react';
import { useState } from 'react';
import FormDrawer from '../general/form-drawer';
import { Button } from '../ui/button';
import { StoresForm } from './form/stores-form';
import { ReviewStoreComplianceForm } from './form/review-store-compliance-form';
import { PolicyQuestionsResponse } from '@/actions/policy/get-policy-questions';

export function ReviewStoreAction(
	props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
		button?: React.ReactNode;
		store?: StoreResponse;
		questions?: PolicyQuestionsResponse;
	}
) {
	const [open, setOpen] = useState(false);

	const onOpenChange = (open: boolean) => {
		setOpen(open);
	};

	return (
		<>
			{props.button ? (
				<div onClick={() => setOpen((prev) => !prev)}>{props.button}</div>
			) : (
				<Button className="w-fit" onClick={() => setOpen((prev) => !prev)}>
					<FolderOpenDot size={16} className="mr-1" />
					Review compliance
				</Button>
			)}

			<FormDrawer open={open} onOpenChange={onOpenChange}>
				<ReviewStoreComplianceForm
					store={props.store}
					questions={props.questions}
					onComplete={() => {
						setOpen(false);
					}}
				/>
			</FormDrawer>
		</>
	);
}
