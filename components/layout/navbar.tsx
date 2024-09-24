'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CreditCard, FrameIcon, Notebook } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from '../auth/user-menu';
import { UserMobileMenu } from '../auth/user-mobile-menu';
import { Button } from '../ui/button';
import { useWindowScrolled } from '../ui/use-window-scrolled';

export const NAVBAR_ITEMS = [
	{ name: 'Pricing', href: '/pricing', icon: <CreditCard className="mr-2 h-4 w-4" /> },
	{ name: 'Docs', href: '/docs', icon: <Notebook className="mr-2 h-4 w-4" /> },
];

interface NavbarProps {
	count?: number;
	sticky?: boolean;
}

export function Navbar(props: NavbarProps) {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);
	const { setTheme, theme } = useTheme();
	const isLightMode = theme === 'light';

	const showDropShadow = useWindowScrolled();

	console.log(isLightMode, 'islighmode');
	return (
		<nav
			style={{
				boxShadow:
					showDropShadow && props.sticky
						? 'rgba(0, 0, 0, 0.05) 0px 1px 20px 0px'
						: 'none',
			}}
			className={`py-6 px-4 md:px-6 h-24 border-b border-border z-[60] transition-all ${
				props.sticky && 'sticky top-0'
			} `}
		>
			{props.sticky && (
				<div
					id="overlap"
					className={`absolute top-0 left-0 w-full h-full backdrop-blur-md transition-all duration-300 bg-[hsla(var(--background-navbar))]`}
				></div>
			)}

			<div className="flex flex-row justify-between items-center z-[200] relative">
				<Link href="/">
					<div className=" flex items-center text-lg font-light z-[200] relative">
						<FrameIcon className="mr-2" size={30} />
						<p className="hidden md:block">NextJS SaaS Boilerplate</p>
					</div>
				</Link>

				<UserMobileMenu
					user={user}
					navOpen={navOpen}
					onNavOpenChange={(state: boolean) => setNavOpen(state)}
					count={props.count}
				/>
				<div className="md:flex items-center gap-10 hidden">
					<div className="flex ">
						{NAVBAR_ITEMS.map((item, index) => {
							return (
								<Button
									size="lg"
									key={index}
									asChild
									variant="link"
									className="px-4 text-md font-medium"
								>
									<Link href={item.href}>{item.name}</Link>
								</Button>
							);
						})}
					</div>

					<div className="flex">
						<UserMenu user={user} count={props.count} />
					</div>
				</div>
			</div>
		</nav>
	);
}
