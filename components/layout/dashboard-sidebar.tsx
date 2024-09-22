'use client';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { useSidebarItems } from '@/hooks/use-sidebar-items';
import { NavigationMobileDrawer } from './navigation-mobile-drawer';
import { Button } from '../ui/button';
import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export function DashboardSidebar() {
	const SIDEBAR_ITEMS = useSidebarItems();
	const [navOpen, setNavOpen] = useState(false);
	const drawerItems = useSidebarItems();

	return (
		<>
			<div className="py-2 px-4 md:px-6 absolute">
				<NavigationMobileDrawer
					open={navOpen}
					onOpenChange={(state) => {
						setNavOpen(state);
					}}
					drawerItems={drawerItems}
				/>
				<Button
					className="p-0 mr-4 block md:hidden"
					onClick={() => setNavOpen((prev) => !prev)}
					variant="link"
				>
					{navOpen ? (
						<XIcon className="md:hidden" size={30} />
					) : (
						<MenuIcon className="md:hidden" size={30} />
					)}
				</Button>
			</div>
			<Sidebar>
				{SIDEBAR_ITEMS?.map?.((group, index) => {
					if (group.visible === false) return null;
					return (
						<SidebarGroup key={index} text={group.name} visible={group.visible}>
							{group.items.map((item, index) => {
								if (!item.visible) return null;
								return (
									<SidebarItem
										key={index}
										text={item.text}
										link={item.link}
										icon={item.icon}
									/>
								);
							})}
						</SidebarGroup>
					);
				})}
			</Sidebar>
		</>
	);
}
