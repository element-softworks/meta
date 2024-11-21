'use client';
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ExtendedUser } from '@/next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavStripProps {
	user: ExtendedUser | undefined;
}
const EXCLUDED_PATHS = ['admin'];

// Regex pattern to identify UUIDs
const UUID_REGEX = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

export function NavStrip(props: NavStripProps) {
	const pathname = usePathname();

	// Split the pathname and filter out empty segments
	const allSegments = pathname.split('/').filter((path) => path !== '');

	// Create breadcrumbs excluding certain paths
	const displayBreadcrumbs = allSegments.filter((path) => !EXCLUDED_PATHS.includes(path));

	const firstCrumb = displayBreadcrumbs[0];
	const lastTwoBreadCrumbs = displayBreadcrumbs.slice(displayBreadcrumbs.length > 3 ? -2 : -3);

	return (
		<nav className="border-b border-border py-2 px-4 lg:px-6 w-full">
			<div className="flex items-center">
				<Breadcrumb className="flex-1 ml-10 lg:ml-0">
					<BreadcrumbList>
						{displayBreadcrumbs.length > 3 ? (
							<>
								<BreadcrumbItem>
									<Link href={`/${firstCrumb}`}>{firstCrumb}</Link>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbEllipsis />
								</BreadcrumbItem>
							</>
						) : null}

						{lastTwoBreadCrumbs.map((path, index) => {
							const isActive = index === lastTwoBreadCrumbs.length - 1;
							const isUUID = UUID_REGEX.test(path);
							const pathUrl = allSegments
								.slice(0, allSegments.indexOf(path) + 1)
								.join('/');

							const previousCrumb =
								displayBreadcrumbs[displayBreadcrumbs.indexOf(path) - 1];

							return (
								<React.Fragment key={index}>
									{index !== 0 ? <BreadcrumbSeparator /> : null}

									<BreadcrumbItem className={`${isActive ? 'font-bold' : ''}`}>
										{isActive ? (
											<p>
												{isUUID
													? previousCrumb?.slice(
															0,
															previousCrumb?.length - 1
														)
													: path}
											</p>
										) : (
											<Link href={`/${pathUrl}`}>
												{isUUID
													? previousCrumb?.slice(
															0,
															previousCrumb?.length - 1
														)
													: path}
											</Link>
										)}
									</BreadcrumbItem>
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</nav>
	);
}
