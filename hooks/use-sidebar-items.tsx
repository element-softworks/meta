'use client';

import { BugPlay, ChartPie, CreditCard, LayoutDashboard, Pen, Users } from 'lucide-react';
import { useCurrentUser } from './use-current-user';

export function useSidebarItems() {
	const user = useCurrentUser();

	const SIDEBAR_ITEMS = [
		{
			name: 'General',
			items: [
				{
					text: 'Home',
					link: '/dashboard',
					icon: <LayoutDashboard size={20} />,
					visible: true,
				},
			],
		},

		{
			name: 'Admin',
			accordion: true,
			visible: user?.role === 'ADMIN',
			items: [
				{
					text: 'Analytics',
					link: '/dashboard/admin/analytics',
					icon: <ChartPie size={20} />,
					visible: true,
				},
				{
					text: 'Users',
					link: '/dashboard/admin/users',
					icon: <Users size={20} />,
					visible: true,
				},

				{
					text: 'Reported bugs',
					link: '/dashboard/admin/bugs',
					icon: <BugPlay size={20} />,
					visible: true,
				},
			],
		},
	];

	return SIDEBAR_ITEMS;
}
