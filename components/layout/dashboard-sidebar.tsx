'use client';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { useSidebarItems } from '@/hooks/use-sidebar-items';

export function DashboardSidebar() {
	const SIDEBAR_ITEMS = useSidebarItems();

	return (
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
	);
}
