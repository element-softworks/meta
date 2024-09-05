'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useEffect } from 'react';
import { SidebarGroup, SidebarItem } from './sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Button } from '../ui/button';
import Image from 'next/image';
import { PlusIcon } from 'lucide-react';

interface TeamsDrawerProps {
	open: boolean;
	onOpenChange: (state: boolean) => void;
}

export function TeamsDrawer(props: TeamsDrawerProps) {
	const { onOpenChange } = props;
	const isMobile = useBreakpoint('md');

	const currentUser = useCurrentUser();
	useEffect(() => {
		if (isMobile) return;
		onOpenChange(false);
	}, [isMobile, onOpenChange]);

	return (
		<Drawer
			direction="left"
			open={props.open}
			onOpenChange={(state) => props.onOpenChange(state)}
		>
			<DrawerContent
				disableDropper
				className="w-[360px] max-w-[80%] h-full rounded-tl-none rounded-bl-none p-6"
			>
				<SidebarGroup mobile text="Current team">
					<SidebarItem
						onClick={() => props.onOpenChange(false)}
						text="Nathans team"
						link=""
						icon={
							<Image
								alt="Current team"
								height={50}
								width={50}
								src="data:image/png;base64,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"
								className="overflow-hidden max-h-full w-auto mr-2 rounded-sm"
							/>
						}
					/>
				</SidebarGroup>
				<div className="mt-auto">
					<SidebarItem
						onClick={() => props.onOpenChange(false)}
						text="Create a new team"
						link="/"
						icon={<PlusIcon />}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
