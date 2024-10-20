'use client';

import { ExtendedUser } from '@/next-auth';
import {
	Bell,
	CreditCard,
	LayoutDashboard,
	LogIn,
	LogOut,
	MenuIcon,
	Moon,
	Settings,
	ShieldCheck,
	Sun,
	XIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogoutButton } from './logout-button';
import { NAVBAR_ITEMS } from '../layout/navbar';
import { LoginButton } from './login-button';
import { NotificationsIcon } from '../general/notifications-icon';
import { ReportBugDialog } from '../dialogs/report-bug-dialog';

interface UserMobileMenuProps {
	user: ExtendedUser | undefined;
	navOpen: boolean;
	onNavOpenChange: (state: boolean) => void;
	count?: number;
}
export function UserMobileMenu(props: UserMobileMenuProps) {
	const { setTheme, theme } = useTheme();
	const isLightMode = theme === 'light';

	const accountItems = !props.user ? null : (
		<>
			<DropdownMenuSeparator />
			<DropdownMenuLabel>Account</DropdownMenuLabel>

			<DropdownMenuGroup>
				<Link href="/dashboard/settings">
					<DropdownMenuItem className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</DropdownMenuItem>
				</Link>
				<Link href="/dashboard/security">
					<DropdownMenuItem className="cursor-pointer">
						<ShieldCheck className="mr-2 h-4 w-4" />
						Security
					</DropdownMenuItem>
				</Link>
				<Link href={`/dashboard/teams/${props.user?.currentTeam}/billing`}>
					<DropdownMenuItem className="cursor-pointer">
						<CreditCard className="mr-2 h-4 w-4" />
						Billing
					</DropdownMenuItem>
				</Link>
			</DropdownMenuGroup>
		</>
	);

	return (
		<div className="block lg:hidden">
			{/* Mobile menu */}
			<DropdownMenu onOpenChange={(open) => props.onNavOpenChange(open)}>
				<DropdownMenuTrigger asChild className="cursor-pointer">
					<Button
						className="dark:text-white text-black"
						aria-label="Open user menu"
						onClick={() => props.onNavOpenChange(!props.navOpen)}
						variant="link"
					>
						{props.navOpen ? (
							<XIcon className="lg:hidden" size={30} />
						) : (
							<MenuIcon className="lg:hidden" size={30} />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={`w-80 mr-2`}>
					<DropdownMenuLabel>General</DropdownMenuLabel>
					<DropdownMenuGroup>
						{NAVBAR_ITEMS.map((item, index) => {
							return (
								<Link key={index} href={item.href}>
									<DropdownMenuItem className="cursor-pointer">
										{item.icon}
										{item.name}
									</DropdownMenuItem>
								</Link>
							);
						})}

						{!props.user ? null : (
							<>
								<Link href="/dashboard">
									<DropdownMenuItem className="cursor-pointer">
										<LayoutDashboard className="mr-2 h-4 w-4" />
										<span>Dashboard</span>
									</DropdownMenuItem>
								</Link>
								<Link href="/dashboard/notifications">
									<DropdownMenuItem className="cursor-pointer relative">
										<Bell className="mr-2 h-4 w-4" />
										<NotificationsIcon
											className="top-0 left-4 absolute"
											count={props.count}
										/>
										<span>Notifications</span>
									</DropdownMenuItem>
								</Link>
							</>
						)}
					</DropdownMenuGroup>

					{accountItems}

					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="cursor-pointer"
						onClick={() => setTheme(isLightMode ? 'dark' : 'light')}
					>
						{isLightMode ? (
							<Moon className="mr-2 h-4 w-4" />
						) : (
							<Sun className="mr-2 h-4 w-4" />
						)}
						{isLightMode ? 'Toggle dark mode' : 'Toggle light mode'}
					</DropdownMenuItem>
					{!props.user ? (
						<Link href="/auth/login">
							<DropdownMenuItem className="cursor-pointer">
								<LogIn className="mr-2 h-4 w-4" />
								<span>Sign in</span>
							</DropdownMenuItem>
						</Link>
					) : (
						<>
							<LogoutButton>
								<DropdownMenuItem className="cursor-pointer">
									<LogOut className="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</LogoutButton>
						</>
					)}
					<DropdownMenuSeparator />

					<ReportBugDialog />
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
