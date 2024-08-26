'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FaUser } from 'react-icons/fa';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LogoutButton } from './logout-button';
import { LogOut } from 'lucide-react';
import { DropdownMenuLabel, DropdownMenuSeparator } from '../ui/dropdown-menu';

export function UserButton() {
	const user = useCurrentUser();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image || ''} alt="User avatar" />
					<AvatarFallback>
						<FaUser />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56  rounded-md">
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
				</DropdownMenuCheckboxItem> */}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
