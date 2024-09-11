'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CreditCard, FrameIcon, Notebook } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from '../auth/user-menu';
import { UserMobileMenu } from '../auth/user-mobile-menu';
import { Button } from '../ui/button';

export const NAVBAR_ITEMS = [
	{ name: 'Pricing', href: '/pricing', icon: <CreditCard className="mr-2 h-4 w-4" /> },
	{ name: 'Docs', href: '/docs', icon: <Notebook className="mr-2 h-4 w-4" /> },
];

interface NavbarProps {}

export function Navbar(props: NavbarProps) {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);
	const { setTheme, theme } = useTheme();
	const isLightMode = theme === 'light';
	return (
		<nav className="py-6 px-4 md:px-6 flex flex-row justify-between items-center h-24">
			<Link href="/">
				<div className="z-10 flex items-center text-lg font-light">
					<FrameIcon className="mr-2" size={30} />
					<p className="hidden md:block">NextJS SaaS Boilerplate</p>
				</div>
			</Link>

			<UserMobileMenu
				user={user}
				navOpen={navOpen}
				onNavOpenChange={(state: boolean) => setNavOpen(state)}
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
					<UserMenu user={user} />
				</div>
			</div>
		</nav>
	);
}
