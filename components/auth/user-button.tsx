'use client';

import { ExtendedUser } from '@/next-auth';
import { CreditCard, LogOut, Moon, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
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
import { useTheme } from 'next-themes';

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
							<AvatarImage src={props.user?.image || ''} alt="props.User avatar" />
							<AvatarFallback>
								<FaUser />
							</AvatarFallback>
						</Avatar>
						<p className="font-normal ml-2">Account</p>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56 mr-2">
				<DropdownMenuLabel>Account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<Link href="/dashboard/account/settings">
						<DropdownMenuItem className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
					</Link>
					<Link href="/dashboard/account/billing">
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
