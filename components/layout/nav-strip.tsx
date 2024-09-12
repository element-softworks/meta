'use client';
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { TeamSelectMenu } from '../auth/team-select-menu';
import { Button } from '../ui/button';
import { NavigationMobileDrawer } from './navigation-mobile-drawer';
import { ExtendedUser } from '@/next-auth';
import { useSidebarItems } from '@/hooks/use-sidebar-items';

interface NavStripProps {
	user: ExtendedUser | undefined;
}
const EXCLUDED_PATHS = ['admin'];

export function NavStrip(props: NavStripProps) {
	const drawerItems = useSidebarItems();
	const pathname = usePathname();

	// Split the pathname and filter out empty segments
	const allSegments = pathname.split('/').filter((path) => path !== '');

	// Create breadcrumbs excluding certain paths for display purposes
	const displayBreadcrumbs = allSegments.filter((path) => !EXCLUDED_PATHS.includes(path));

	const firstCrumb = displayBreadcrumbs[0];
	const lastTwoBreadCrumbs = displayBreadcrumbs.slice(displayBreadcrumbs.length > 3 ? -2 : -3);
	const showCrumbEllipsis = displayBreadcrumbs.length > 3;

	const [navOpen, setNavOpen] = React.useState(false);

	return (
		<nav className="border-b border-border py-2 px-4 md:px-6 w-full">
			<div className="flex items-center">
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
				<Breadcrumb className="flex-1">
					<BreadcrumbList>
						{displayBreadcrumbs?.length > 3 ? (
							<BreadcrumbItem>
								<Link href={`/${firstCrumb}`}>{firstCrumb}</Link>
							</BreadcrumbItem>
						) : null}
						{lastTwoBreadCrumbs.map((path, index) => {
							const isActive = index === lastTwoBreadCrumbs.length - 1;

							// Construct the path URL including all original segments
							const pathUrl = allSegments
								.slice(0, allSegments.indexOf(path) + 1)
								.join('/');

							return (
								<React.Fragment key={index}>
									{index === 0 && showCrumbEllipsis ? (
										<>
											<BreadcrumbSeparator />
											<BreadcrumbItem>
												<BreadcrumbEllipsis />
											</BreadcrumbItem>
										</>
									) : null}

									<React.Fragment key={index}>
										{index !== 0 ? <BreadcrumbSeparator /> : null}
										<BreadcrumbItem className={`${isActive && 'font-bold'}`}>
											{isActive ? (
												<p>{path}</p>
											) : (
												<Link href={`/${pathUrl}`}>{path}</Link>
											)}
										</BreadcrumbItem>
									</React.Fragment>
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
				<TeamSelectMenu />
			</div>
		</nav>
	);
}
