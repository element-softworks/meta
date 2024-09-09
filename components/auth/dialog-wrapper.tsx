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
	confirmButton?: React.ReactNode;
	disableActions?: boolean;
	isLoading?: boolean;
	button: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	dialog: {
		title: string;
		description: string;
		buttonProps?: ButtonProps;
	};
}

export function DialogWrapper(props: DialogWrapperProps) {
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
			<div onClick={() => props.onOpenChange(true)}>{props.button}</div>

			<DialogContent className={`${width} max-w-[90%]`}>
				<DialogHeader>
					<DialogTitle>{props.dialog.title}</DialogTitle>
					<DialogDescription>{props.dialog.description}</DialogDescription>
				</DialogHeader>
				{props.children}
				{props.disableActions ? null : (
					<DialogFooter className="gap-2 md:gap-0">
						<>
							<Button onClick={() => props.onOpenChange(false)} variant="secondary">
								Cancel
							</Button>

							{!!props.confirmButton ? (
								props.confirmButton
							) : (
								<Button
									disabled={props.isLoading}
									isLoading={props.isLoading}
									onClick={() => props.onSubmit()}
									{...props.dialog.buttonProps}
									type="submit"
								>
									Confirm
								</Button>
							)}
						</>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
