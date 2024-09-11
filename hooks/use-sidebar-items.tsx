'use client';

import { UserRole } from '@prisma/client';
import { CreditCard, LayoutDashboard, Users } from 'lucide-react';
import { useCurrentUser } from './use-current-user';

export function useSidebarItems() {
	const user = useCurrentUser();

	const SIDEBAR_ITEMS = [
		{
			name: 'General',
			items: [
				{
					text: 'Dashboard',
					link: '/dashboard',
					icon: <LayoutDashboard size={20} />,
					visible: true,
				},
				{
					text: 'Billing',
					link: '/dashboard/billing',
					icon: <CreditCard size={20} />,
					visible: true,
				},

				{
					text: !!user?.currentTeam ? 'Team' : 'Teams',
					link: !!user?.currentTeam
						? `/dashboard/teams/${user?.currentTeam}`
						: '/dashboard/teams',
					icon: <Users size={20} />,
					visible: true,
				},
			],
		},
		{
			name: 'Admin',
			visible: user?.role === UserRole.ADMIN,
			items: [
				{
					text: 'Users',
					link: '/dashboard/admin/users',
					icon: <CreditCard size={20} />,
					visible: true,
				},
			],
		},
	];

	return SIDEBAR_ITEMS;
}
