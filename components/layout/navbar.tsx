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
import { Logo } from '../general/logo';

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
				<Link href="/dashboard" aria-label="Go to homepage">
					<Logo noTitle width={34} height={23} />
				</Link>

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
