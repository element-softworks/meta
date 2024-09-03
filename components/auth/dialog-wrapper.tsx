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

interface DialogWrapperProps {
	children?: React.ReactNode;
	open: boolean;
	onOpenChange: (state: boolean) => void;
	onSubmit: () => void;
	isLoading: boolean;
	dialog: {
		title: string;
		description: string;
		buttonProps: ButtonProps;
	};
}

export function DialogWrapper(props: DialogWrapperProps) {
	return (
		<Dialog open={props.open} onOpenChange={(state) => props.onOpenChange(state)}>
			<div onClick={() => props.onOpenChange(true)}>{props.children}</div>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{props.dialog.title}</DialogTitle>
					<DialogDescription>{props.dialog.description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button onClick={() => props.onOpenChange(false)} variant="secondary">
						Cancel
					</Button>
					<Button
						disabled={props.isLoading}
						isLoading={props.isLoading}
						onClick={() => props.onSubmit()}
						{...props.dialog.buttonProps}
						type="submit"
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
