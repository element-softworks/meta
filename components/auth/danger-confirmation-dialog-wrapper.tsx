'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button, ButtonProps } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';

interface DangerConfirmationDialogWrapperProps {
	code?: string;
	children?: React.ReactNode;
	open: boolean;
	onOpenChange: (state: boolean) => void;
	onSubmit: () => void;
	isLoading?: boolean;
	button?: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	dialog: {
		title: string;
		description: string;
		buttonProps?: ButtonProps;
	};
}

export function DangerConfirmationDialogWrapper(props: DangerConfirmationDialogWrapperProps) {
	const [confirmed, setConfirmed] = useState(false);
	const [input, setInput] = useState('');

	const confirmationCode = props?.code?.toLowerCase() ?? 'archive';

	const size = props.size ?? 'md';

	let width;
	switch (size) {
		case 'sm':
			width = 'w-[300px]';
			break;
		case 'md':
			width = 'w-[500px]';
			break;
		case 'lg':
			width = 'w-[700px]';
			break;
	}
	return (
		<Dialog open={props.open} onOpenChange={(state) => props.onOpenChange(state)}>
			<div className="w-fit" onClick={() => props.onOpenChange(true)}>
				{props.button}
			</div>

			<DialogContent className={`${width} max-w-[90%]`}>
				<DialogHeader>
					<DialogTitle>{props.dialog.title}</DialogTitle>
					<DialogDescription>{props.dialog.description}</DialogDescription>
					<DialogDescription>Type "{confirmationCode}" to confirm</DialogDescription>

					<Input value={input} onChange={(e) => setInput(e.target.value)} />
				</DialogHeader>
				{props.children}

				<DialogFooter className="gap-2 md:gap-0">
					<>
						<Button onClick={() => props.onOpenChange(false)} variant="secondary">
							Cancel
						</Button>

						<Button
							disabled={
								props.isLoading || !(input?.toLowerCase() === confirmationCode)
							}
							isLoading={props.isLoading}
							onClick={() => props.onSubmit()}
							{...props.dialog.buttonProps}
							type="submit"
						>
							Confirm
						</Button>
					</>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
