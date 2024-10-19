'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useEffect } from 'react';
import { SideBarItem, SidebarGroup, SidebarItem } from './sidebar';

interface NavigationMobileDrawerProps {
	open: boolean;
	onOpenChange: (state: boolean) => void;
	drawerItems: {
		name: string;
		visible?: boolean;
		items: {
			text: string;
			link: string;
			icon: React.ReactNode;
			nested?: SideBarItem;
		}[];
	}[];
}

export function NavigationMobileDrawer(props: NavigationMobileDrawerProps) {
	const { onOpenChange } = props;
	const isMobile = useBreakpoint('md');
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
				{props.drawerItems?.map((group, index) => {
					return (
						<SidebarGroup mobile key={index} text={group.name} visible={group.visible}>
							{group.items.map((item, index) => (
								<SidebarItem
									onClick={() => props.onOpenChange(false)}
									key={index}
									text={item.text}
									link={item.link}
									icon={item.icon}
								/>
							))}
						</SidebarGroup>
					);
				})}
			</DrawerContent>
		</Drawer>
	);
}
