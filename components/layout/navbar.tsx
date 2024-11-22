'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Book, CreditCard, FrameIcon, Notebook, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { NotificationsMenu } from '../auth/notifications-menu';
import { UserMenu } from '../auth/user-menu';
import { UserMobileMenu } from '../auth/user-mobile-menu';
import { useWindowScrolled } from '../ui/use-window-scrolled';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export const NAVBAR_ITEMS = [];

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
	const { theme } = useTheme();

	console.log(theme, 'theme move');

	return (
		<nav
			style={{
				boxShadow:
					showDropShadow && props.sticky
						? 'rgba(0, 0, 0, 0.05) 0px 1px 20px 0px'
						: 'none',
			}}
			className={`py-2 lg:py-4 px-4 lg:px-6 lg:h-20 z-40 transition-all shadow-md ${
				props.sticky && 'sticky top-0'
			} 
			`}
		>
			{props.sticky && (
				<div
					id="overlap"
					className={`absolute top-0 left-0 w-full h-full shadow backdrop-blur-md transition-all duration-300 bg-primary-foreground`}
				></div>
			)}

			<div
				className={`flex flex-row justify-between items-center z-[200] relative ${
					props.contained && 'container px-0'
				}`}
			>
				<Link href="/dashboard" aria-label="Go to homepage">
					<Image
						unoptimized
						src={theme === 'dark' ? '/coaching-logo-white.svg' : '/coaching-logo.svg'}
						width={50}
						height={40}
						alt="Logo"
					/>
				</Link>

				<div className="lg:flex items-center gap-10">
					{/* <div className="flex ">
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
					</div> */}

					<div className="flex gap-2">
						{/* <NotificationsMenu /> */}
						<UserMenu user={user} count={props.count} />
					</div>
				</div>
			</div>
		</nav>
	);
}
