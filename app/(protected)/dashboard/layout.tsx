import { auth } from '@/auth';
import { NavStrip } from '@/components/layout/nav-strip';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserRole } from '@prisma/client';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const SIDEBAR_ITEMS = [
		{
			name: 'General',
			items: [
				{
					text: 'Dashboard',
					link: '/dashboard',
					icon: <LayoutDashboard size={20} />,
				},
			],
		},
		{
			name: 'Account',
			items: [
				{
					text: 'Account settings',
					link: '/dashboard/settings',
					icon: <Settings size={20} />,
				},
				{
					text: 'Billing',
					link: '/dashboard/billing',
					icon: <CreditCard size={20} />,
				},
			],
		},
		{
			name: 'Admin',
			visible: session?.user?.role === UserRole.ADMIN,
			items: [
				{
					text: 'Users',
					link: '/dashboard/admin/users',
					icon: <CreditCard size={20} />,
				},
			],
		},
	];
	return (
		<SessionProvider session={session}>
			<Toaster />
			<div className="flex flex-col min-h-screen ">
				<Navbar />

				<div className="border-t border-border flex flex-1">
					<Sidebar>
						{SIDEBAR_ITEMS.map((group, index) => (
							<SidebarGroup key={index} text={group.name} visible={group.visible}>
								{group.items.map((item, index) => (
									<SidebarItem
										key={index}
										text={item.text}
										link={item.link}
										icon={item.icon}
									/>
								))}
							</SidebarGroup>
						))}
					</Sidebar>
					<main className="w-full p-4 md:p-6 overflow-hidden">
						<NavStrip drawerItems={SIDEBAR_ITEMS} />
						{children}
					</main>
				</div>
			</div>
		</SessionProvider>
	);
}
