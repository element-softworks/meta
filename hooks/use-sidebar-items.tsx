'use client';

import { UserRole } from '@prisma/client';
import { Banknote, CreditCard, LayoutDashboard, Users } from 'lucide-react';
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
			],
		},
		{
			name: 'Team',
			items: [
				{
					text: 'Billing',
					link: `/dashboard/teams/${user?.currentTeam}/billing`,
					icon: <CreditCard size={20} />,
					visible: true,
				},
				{
					text: 'Invoices',
					link: `/dashboard/teams/${user?.currentTeam}/invoices`,
					icon: <Banknote size={20} />,
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
