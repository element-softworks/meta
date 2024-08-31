'use client';

import { ExtendedUser } from '@/next-auth';
import { Button } from '../ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaUser } from 'react-icons/fa';
import { CreditCard, Keyboard, LogOut, Settings, User } from 'lucide-react';
import { LogoutButton } from './logout-button';
import Link from 'next/link';

interface UserButtonProps {
	user: ExtendedUser | undefined;
}
export function UserButton(props: UserButtonProps) {
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
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>My account</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<Link href="/dashboard/account/profile">Profile</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<CreditCard className="mr-2 h-4 w-4" />
						<Link href="/dashboard/account/billing">Billing</Link>
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						<Link href="/dashboard/account/settings">Settings</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
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

{
	/* <DropdownMenu>
				<DropdownMenuTrigger>
					<Button asChild variant="outline">
						<div>
							<Avatar className="size-7">
								<AvatarImage
									src={props.user?.image || ''}
									alt="props.User avatar"
								/>
								<AvatarFallback>
									<FaUser />
								</AvatarFallback>
							</Avatar>
							<p className="font-normal ml-2">Account</p>
						</div>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-56 mt-2 mr-2  rounded-md">
					<Card>
						<LogoutButton>
							<DropdownMenuItem className="flex gap-1 items-center p-2">
								<LogOut className="size-5" /> Logout
							</DropdownMenuItem>
						</LogoutButton>
						{/* <DropdownMenuCheckboxItem
					checked={showStatusBar}
					onCheckedChange={setShowStatusBar}
				>
					Status Bar
				</DropdownMenuCheckboxItem> */
}
// 		</Card>
// 	</DropdownMenuContent>
// </DropdownMenu> */}
