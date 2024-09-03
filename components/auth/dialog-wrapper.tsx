'use client';
import { ExtendedUser } from '@/next-auth';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button, ButtonProps } from '../ui/button';
import { adminArchiveUser } from '@/actions/admin-archive-user';
import { useMutation } from '@/hooks/use-mutation';
import { useState } from 'react';
import { TableUser } from '../tables/users-table';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';

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
