'use client';

import {
	Banknote,
	BugPlay,
	ChartBar,
	ChartPie,
	CreditCard,
	DollarSign,
	Flag,
	LayoutDashboard,
	PiggyBank,
	Users,
	Users2,
} from 'lucide-react';
import { useCurrentUser } from './use-current-user';
import { FaMoneyBill } from 'react-icons/fa';

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
			visible: user?.role === 'ADMIN',
			items: [
				{
					text: 'Users',
					link: '/dashboard/admin/users',
					icon: <Users size={20} />,
					visible: true,
				},
				{
					text: 'Teams',
					link: '/dashboard/admin/teams',
					icon: <Flag size={20} />,
					visible: true,
				},
				{
					text: 'Analytics',
					link: '/dashboard/admin/analytics',
					icon: <ChartPie size={20} />,
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
