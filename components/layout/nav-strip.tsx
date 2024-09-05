'use client';
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { MenuIcon, XIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { NavigationMobileDrawer } from './navigation-mobile-drawer';
import Link from 'next/link';
import { TeamsButton } from './teams-button';

interface NavStripProps {
	drawerItems: {
		name: string;
		items: {
			text: string;
			link: string;
			icon: React.ReactNode;
		}[];
	}[];
}

const EXCLUDED_PATHS = ['admin'];

export function NavStrip(props: NavStripProps) {
	const pathname = usePathname();

	const breadcrumbs = pathname
		.split('/')
		.filter((path) => path !== '')
		?.filter((path) => !EXCLUDED_PATHS.includes(path));

	const firstCrumb = breadcrumbs[0];
	const lastTwoBreadCrumbs = breadcrumbs.slice(breadcrumbs.length > 3 ? -2 : -3);
	const showCrumbEllipsis = breadcrumbs.length > 3;

	const [navOpen, setNavOpen] = React.useState(false);

	return (
		<nav className="border-b border-border py-4 md:py-6 px-4 md:px-6 w-full">
			<div className="flex items-center">
				<NavigationMobileDrawer
					open={navOpen}
					onOpenChange={(state) => {
						setNavOpen(state);
					}}
					drawerItems={props.drawerItems}
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
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs?.length > 3 ? (
							<BreadcrumbItem>
								<Link href={`/${firstCrumb}`}>{firstCrumb}</Link>
							</BreadcrumbItem>
						) : null}
						{lastTwoBreadCrumbs.map((path, index) => {
							const isActive = index === lastTwoBreadCrumbs.length - 1;
							const crumbIndex =
								breadcrumbs.length - lastTwoBreadCrumbs.length + index;
							const pathUrl = breadcrumbs.slice(0, crumbIndex + 1).join('/');
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
			</div>
		</nav>
	);
}
