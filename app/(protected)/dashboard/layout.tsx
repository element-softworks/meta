import { auth } from '@/auth';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { UserRole } from '@prisma/client';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<Toaster />
			<div className="flex flex-col min-h-screen ">
				<Navbar />

				<div className="border-t border-border flex flex-1">
					<Sidebar>
						<SidebarGroup text="General">
							<SidebarItem
								text="Dashboard"
								link="/dashboard"
								icon={<LayoutDashboard size={20} />}
							/>
						</SidebarGroup>
						<SidebarGroup text="Account">
							<SidebarItem
								text="Account settings"
								link="/dashboard/account/settings"
								icon={<Settings size={20} />}
							/>

							<SidebarItem
								text="Billing"
								link="/dashboard/account/billing"
								icon={<CreditCard size={20} />}
							/>
						</SidebarGroup>
						<SidebarGroup visible={session?.user?.role === UserRole.ADMIN} text="Admin">
							<SidebarItem
								text="Users"
								link="/dashboard/admin/users"
								icon={<CreditCard size={20} />}
							/>
						</SidebarGroup>
					</Sidebar>
					<main className="w-full p-6">{children}</main>
				</div>
			</div>
		</SessionProvider>
	);
}
