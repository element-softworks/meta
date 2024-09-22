'use client';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { Code, Lightbulb, MenuIcon, XIcon, Zap } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { NavigationMobileDrawer } from './navigation-mobile-drawer';

export function DocsSidebar() {
	const SIDEBAR_ITEMS = [
		{
			name: 'Getting setup',

			items: [
				{
					text: 'Introduction',
					link: '/docs#introduction',
					icon: <Lightbulb size={20} />,
					visible: true,
				},
				{
					text: 'Quick start',
					link: '/docs#quick-start',
					icon: <Zap size={20} />,
					visible: true,
				},
				{
					text: 'Code blocks',
					link: '/docs#code-blocks',
					icon: <Code size={20} />,
					visible: true,
				},
			],
		},
	];

	const [navOpen, setNavOpen] = useState(false);
	return (
		<>
			<div className="py-2 px-4 md:px-6 absolute">
				<NavigationMobileDrawer
					open={navOpen}
					onOpenChange={(state) => {
						setNavOpen(state);
					}}
					drawerItems={SIDEBAR_ITEMS}
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
			<Sidebar fixed>
				{SIDEBAR_ITEMS?.map?.((group, index) => {
					return (
						<SidebarGroup key={index} text={group.name} visible={true}>
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
