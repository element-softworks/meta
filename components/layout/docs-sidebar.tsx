'use client';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { AppWindowMac, Code, Columns2, Lightbulb, MenuIcon, XIcon, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { NavigationMobileDrawer } from './navigation-mobile-drawer';
import { usePathname, useRouter } from 'next/navigation';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export function DocsSidebar() {
	const nextPathname = usePathname();
	const isMobile = useBreakpoint('lg');

	const pathname = typeof window !== 'undefined' && window.location; // Initialize the router
	const router = useRouter();
	const [currentSection, setCurrentSection] = useState('');
	// Function to handle the scroll detection and update current section
	const handleScroll = () => {
		if (isMobile) return;
		setCurrentSection((pathname as any)?.hash);

		const sections = document.querySelectorAll('.docs-section'); // Select section headers

		sections.forEach((section) => {
			const rect = section.getBoundingClientRect(); // Get section's position relative to viewport

			// Check if any part of the section is visible in the viewport
			if (rect.top < window.innerHeight && rect.bottom > 0) {
				router.push(nextPathname + `#${section.id}`, { scroll: false });
			}
		});
	};

	useEffect(() => {
		if (isMobile) return;
		handleScroll();

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [currentSection, nextPathname]);

	const SIDEBAR_ITEMS = [
		{
			name: 'Getting setup',

			items: [
				{
					text: 'Introduction',
					link: '/docs#introduction',
					icon: <Lightbulb size={20} />,
					visible: true,
					active: currentSection === '#introduction',
				},
				{
					text: 'Quick start',
					link: '/docs#quick-start',
					icon: <Zap size={20} />,
					visible: true,
					active: currentSection === '#quick-start',
					nested: [],
				},
			],
		},
		{
			name: 'Creating docs',

			items: [
				{
					text: 'Overview',
					link: '/docs/creating-docs#overview',
					icon: <AppWindowMac size={20} />,
					visible: true,
					active: currentSection === '#overview',
				},
				{
					text: 'Sidebar',
					link: '/docs/creating-docs#docs-sidebar',
					icon: <Columns2 size={20} />,
					visible: true,
					active: currentSection === '#docs-sidebar',
				},
				{
					text: 'Code blocks',
					link: '/docs/creating-docs#code-blocks',
					icon: <Code size={20} />,
					visible: true,
					active: currentSection === '#code-blocks',
				},
			],
		},
	];

	const [navOpen, setNavOpen] = useState(false);
	return (
		<>
			<div className="py-2 px-4 lg:px-6 absolute">
				<NavigationMobileDrawer
					open={navOpen}
					onOpenChange={(state) => {
						setNavOpen(state);
					}}
					drawerItems={SIDEBAR_ITEMS}
				/>
				<Button
					className="p-0 mr-4 block lg:hidden dark:text-white text-black"
					onClick={() => setNavOpen((prev) => !prev)}
					variant="link"
				>
					{navOpen ? (
						<XIcon className="lg:hidden dark:text-white text-black" size={30} />
					) : (
						<MenuIcon className="lg:hidden dark:text-white text-black" size={30} />
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
										nested={item.nested}
										active={item.active}
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
