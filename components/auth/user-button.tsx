'use client';

import { ExtendedUser } from '@/next-auth';
import { CreditCard, LogOut, Moon, Settings, Sun } from 'lucide-react';
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

interface UserButtonProps {
	user: ExtendedUser | undefined;
}
export function UserButton(props: UserButtonProps) {
	const { setTheme, theme } = useTheme();

	const isLightMode = theme === 'light';

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="cursor-pointer">
				<Button asChild variant="outline">
					<div>
						<Avatar className="size-7">
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
						<p className="font-normal ml-2">Account</p>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 mr-2">
				<DropdownMenuLabel>Account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<Link href="/dashboard/settings">
						<DropdownMenuItem className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
					</Link>
					<Link href="/dashboard/billing">
						<DropdownMenuItem className="cursor-pointer">
							<CreditCard className="mr-2 h-4 w-4" />
							Billing
						</DropdownMenuItem>
					</Link>
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
