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

const EXCLUDED_PATHS = ['dashboard', 'admin'];

export function NavStrip(props: NavStripProps) {
	const pathname = usePathname();

	const breadcrumbs = pathname
		.split('/')
		.filter((path) => path !== '')
		?.filter((path) => !EXCLUDED_PATHS.includes(path));

	const lastTwoBreadCrumbs = breadcrumbs.slice(-2);
	const showCrumbEllipsis = breadcrumbs.length > 2;

	const [navOpen, setNavOpen] = React.useState(false);

	return (
		<nav className="border-b border-border py-4 md:py-6 px-6 md:px-6 w-full flex items-center">
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
					<BreadcrumbItem>
						{!breadcrumbs?.length ? (
							<p className="font-bold">Dashboard</p>
						) : (
							<Link href="/dashboard">Dashboard</Link>
						)}
					</BreadcrumbItem>
					{showCrumbEllipsis ? (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbEllipsis />
							</BreadcrumbItem>
						</>
					) : null}
					{lastTwoBreadCrumbs.map((path, index) => {
						const isActive = index === lastTwoBreadCrumbs.length - 1;
						const crumbIndex = breadcrumbs.length - lastTwoBreadCrumbs.length + index;
						const pathUrl = breadcrumbs.slice(0, crumbIndex + 1).join('/');
						return (
							<React.Fragment key={index}>
								<BreadcrumbSeparator />
								<BreadcrumbItem className={`${isActive && 'font-bold'}`}>
									{isActive ? (
										<p>{path}</p>
									) : (
										<Link href={`/${pathUrl}`}>{path}</Link>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</nav>
	);
}
