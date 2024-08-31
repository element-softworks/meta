import { Navbar } from '@/components/layout/navbar';
import { Sidebar, SidebarItem } from '@/components/layout/sidebar';
import { CreditCard, LayoutDashboard, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar />

			<div className="border-t border-border flex ">
				<Sidebar>
					<SidebarItem
						text="Dashboard"
						link="/dashboard"
						icon={<LayoutDashboard size={20} />}
					/>
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
				</Sidebar>
				<main className="items-center justify-center flex w-full bg-muted">{children}</main>
			</div>
		</div>
	);
}
