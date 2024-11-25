'use client';

import { ExtendedUser } from '@/next-auth';
import {
	Bell,
	CreditCard,
	LayoutDashboard,
	LogOut,
	Moon,
	Settings,
	ShieldCheck,
	Sun,
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
import { NotificationsIcon } from '../general/notifications-icon';
import { ReportBugDialog } from '../dialogs/report-bug-dialog';

interface UserMenuProps {
	user: ExtendedUser | undefined;
	count?: number;
}
export function UserMenu(props: UserMenuProps) {
	const { setTheme, theme } = useTheme();
	const isLightMode = theme === 'light';

	if (!props.user) {
		return (
			<Link href="/auth/login">
				<Button>Get started</Button>
			</Link>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="cursor-pointer">
				<Button className="px-0 py-0 bg-transparent" asChild variant="ghost">
					<div className="relative">
						<Avatar className="size-8 relative">
							{props.user?.image && (
								<AvatarImage
									width={35}
									height={35}
									src={props.user?.image}
									alt="user avatar"
								/>
							)}
							<AvatarFallback>{props.user?.name?.slice(0, 2)}</AvatarFallback>
						</Avatar>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 mr-2">
				{!props.user ? null : (
					<>
						<DropdownMenuLabel>General</DropdownMenuLabel>

						<Link href="/dashboard" className="text-foreground">
							<DropdownMenuItem className="cursor-pointer">
								<LayoutDashboard className="mr-2 h-4 w-4" />
								<span>Home</span>
							</DropdownMenuItem>
						</Link>
						<Link href="/dashboard/notifications" className="text-foreground">
							<DropdownMenuItem className="cursor-pointer relative">
								<Bell className="mr-2 h-4 w-4" />
								<NotificationsIcon
									className="top-0 left-4 absolute"
									count={props.count}
								/>
								<span>Notifications</span>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuLabel>Account</DropdownMenuLabel>

				<DropdownMenuGroup>
					<DropdownMenuGroup>
						<Link href="/dashboard/settings" className="text-foreground">
							<DropdownMenuItem className="cursor-pointer">
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
						</Link>
						<Link href="/dashboard/security" className="text-foreground">
							<DropdownMenuItem className="cursor-pointer">
								<ShieldCheck className="mr-2 h-4 w-4" />
								Security
							</DropdownMenuItem>
						</Link>
					</DropdownMenuGroup>
				</DropdownMenuGroup>
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
				<LogoutButton>
					<DropdownMenuItem className="cursor-pointer">
						<LogOut className="mr-2 h-4 w-4" />
						<span>Log out</span>
					</DropdownMenuItem>
				</LogoutButton>

				<DropdownMenuSeparator />

				<ReportBugDialog />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
