'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Book, CreditCard, FrameIcon, Notebook, Phone } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from '../auth/user-menu';
import { UserMobileMenu } from '../auth/user-mobile-menu';
import { Button } from '../ui/button';
import { useWindowScrolled } from '../ui/use-window-scrolled';
import { FaBlog } from 'react-icons/fa';

export const NAVBAR_ITEMS = [
	{ name: 'Pricing', href: '/#pricing', icon: <CreditCard className="mr-2 h-4 w-4" /> },
	{
		name: 'Contact',
		href: '/#contact',
		icon: <Phone className="mr-2 h-4 w-4" />,
	},
	{ name: 'Blog', href: '/blog', icon: <Book className="mr-2 h-4 w-4" /> },
	{ name: 'Docs', href: '/docs', icon: <Notebook className="mr-2 h-4 w-4" /> },
];

interface NavbarProps {
	count?: number;
	sticky?: boolean;
	contained?: boolean;
	disableBorderBottom?: boolean;
}

export function Navbar(props: NavbarProps) {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);

	const showDropShadow = useWindowScrolled();
	return (
		<nav
			style={{
				boxShadow:
					showDropShadow && props.sticky
						? 'rgba(0, 0, 0, 0.05) 0px 1px 20px 0px'
						: 'none',
			}}
			className={`py-2 lg:py-4 px-4 lg:px-6 lg:h-20 z-40 transition-all ${
				props.sticky && 'sticky top-0'
			} 
			${
				props.disableBorderBottom
					? `${showDropShadow ? 'border-b border-border transition-all' : ''}`
					: 'border-b border-border'
			}
			`}
		>
			{props.sticky && (
				<div
					id="overlap"
					className={`absolute top-0 left-0 w-full h-full backdrop-blur-md transition-all duration-300 bg-[hsla(var(--nav-background))]`}
				></div>
			)}

			<div
				className={`flex flex-row justify-between items-center z-[200] relative ${
					props.contained && 'container px-0'
				}`}
			>
				<Link href="/" aria-label="Go to homepage">
					<div className=" flex items-center text-lg font-light z-[200] relative">
						<FrameIcon className="mr-2" size={30} />
						<p className="hidden lg:block">NextJS SaaS Boilerplate</p>
					</div>
				</Link>

				<UserMobileMenu
					user={user}
					navOpen={navOpen}
					onNavOpenChange={(state: boolean) => setNavOpen(state)}
					count={props.count}
				/>
				<div className="lg:flex items-center gap-10 hidden">
					<div className="flex ">
						{NAVBAR_ITEMS.map((item, index) => {
							return (
								<Link
									key={index}
									className="px-4 text-md font-medium"
									href={item.href}
								>
									{item.name}
								</Link>
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
