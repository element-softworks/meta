'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { LogOut } from 'lucide-react';
import { FaUser } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { LogoutButton } from './logout-button';
import { ExtendedUser } from '@/next-auth';

interface UserButtonProps {
	user: ExtendedUser | undefined;
}
export function UserButton(props: UserButtonProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={props.user?.image || ''} alt="props.User avatar" />
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
