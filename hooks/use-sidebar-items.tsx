'use client';

import {
	BugPlay,
	ChartPie,
	File,
	FileQuestion,
	Home,
	LayoutDashboard,
	LocateIcon,
	Users,
} from 'lucide-react';
import { useCurrentUser } from './use-current-user';
import { FaQuestion } from 'react-icons/fa';

export function useSidebarItems() {
	const user = useCurrentUser();

	const SIDEBAR_ITEMS = [
		{
			name: 'General',
			items: [
				{
					text: 'Dashboard',
					link: '/dashboard',
					icon: <Home size={16} />,
					visible: true,
				},
				{
					text: 'Stores',
					link: '/dashboard/stores',
					icon: <LocateIcon size={16} />,
					visible: true,
				},
				{
					text: 'Policies',
					link: '/dashboard/policies',
					icon: <File size={16} />,
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
					icon: <ChartPie size={16} />,
					visible: true,
				},
				{
					text: 'Users',
					link: '/dashboard/admin/users',
					icon: <Users size={16} />,
					visible: true,
				},
				{
					text: 'Question and Answers',
					link: '/dashboard/admin/question-and-answers',
					icon: <FileQuestion size={16} />,
					visible: true,
				},
				{
					text: 'Reported bugs',
					link: '/dashboard/admin/bugs',
					icon: <BugPlay size={16} />,
					visible: true,
				},
			],
		},
	];

	return SIDEBAR_ITEMS;
}
