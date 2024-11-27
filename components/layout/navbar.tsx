'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NotificationsMenu } from '../auth/notifications-menu';
import { UserMenu } from '../auth/user-menu';
import { Logo } from '../general/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useWindowScrolled } from '../ui/use-window-scrolled';

export const NAVBAR_ITEMS = [];

interface NavbarProps {
	count?: number;
	sticky?: boolean;
	contained?: boolean;
	disableBorderBottom?: boolean;
	crumbs?: {
		active: boolean;
		icon?: React.ReactNode;
		default?: string;
		text?: string;
		options?: {
			key: string;
			name: string;
			href: string;
		}[];
	}[];
}

export function Navbar(props: NavbarProps) {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);

	const router = useRouter();
	const showDropShadow = useWindowScrolled();
	const { theme } = useTheme();

	return (
		<nav
			style={{
				boxShadow:
					showDropShadow && props.sticky
						? 'rgba(0, 0, 0, 0.05) 0px 1px 20px 0px'
						: 'none',
			}}
			className={`py-2 lg:py-4 px-4 lg:px-6 flex items-center lg:h-16 z-40 transition-all shadow-md ${
				props.sticky && 'sticky top-0'
			} 
			`}
		>
			{props.sticky && (
				<div
					id="overlap"
					className={`absolute top-0 left-0 w-full h-full border-b backdrop-blur-md transition-all duration-300 bg-card`}
				></div>
			)}

			<div
				className={`flex-1 flex flex-row justify-between items-center z-[200] relative ${
					props.contained && 'container px-0'
				}`}
			>
				<div className="flex items-center gap-4">
					<Link href="/dashboard" aria-label="Go to homepage">
						<Logo noTitle width={34} height={23} />
					</Link>

					{props?.crumbs?.map?.((data, index) => {
						if (!data?.options?.length) {
							return (
								<>
									<p className="text-lg text-muted ">/</p>

									<p
										className={`font-medium ${
											data?.active ? '' : 'text-muted-foreground'
										}`}
									>
										{data?.text}
									</p>
								</>
							);
						}
						return (
							<>
								<p className="text-lg text-muted">/</p>

								<Select
									key={index}
									defaultValue={data?.options?.[0]?.href}
									onValueChange={(value) => {
										router.push(value);
									}}
								>
									<SelectTrigger
										className={`w-[53px] md:w-fit border-0 [&_svg]:opacity-100 [&_svg]:size-5 ${
											data?.active ? '' : 'text-muted-foreground'
										}`}
									>
										<div className="mr-2">{data?.icon}</div>
										<SelectValue>{data?.default}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{data?.options?.map?.((crumb, crumbIndex) => (
											<SelectItem
												className="cursor-pointer"
												key={crumbIndex}
												value={crumb.href}
											>
												<div className="flex flex-row gap-2 items-center">
													<p className="line-clamp-1 text-base">
														{crumb.name}
													</p>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{index !== (props?.crumbs?.length ?? 0) - 1 && (
									<p className="text-lg text-muted">/</p>
								)}
							</>
						);
					})}
				</div>
				<div className="lg:flex items-center gap-10">
					<div className="flex gap-3">
						<NotificationsMenu />
						<UserMenu user={user} count={props.count} />
					</div>
				</div>
			</div>
		</nav>
	);
}
