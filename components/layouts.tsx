import { getUserNotificationsCount } from '@/actions/account/get-user-notifications-count';
import { auth } from '@/auth';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { Navbar } from '@/components/layout/navbar';

export async function StoresLayout({
	children,
	crumbs,
}: {
	children: React.ReactNode;
	crumbs?: {
		active: boolean;
		icon?: React.ReactNode;
		default?: string;
		text?: string;
		options?: {
			key: string;
			name: string;
			href: string;
		}[];
	}[];
}) {
	const session = await auth();
	const count = await getUserNotificationsCount(session?.user?.id ?? '');

	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar sticky count={count?.count ?? 0} crumbs={crumbs} />
			<div className="flex flex-1">
				<DashboardSidebar />

				<div className="w-full overflow-hidden flex-1 flex flex-col ">
					{/* <NavStrip user={session?.user} /> */}
					<main className="w-full p-4  overflow-hidden flex-1 mt-8 lg:mt-0">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const count = await getUserNotificationsCount(session?.user?.id ?? '');

	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar sticky count={count?.count ?? 0} />
			<div className="flex flex-1">
				<DashboardSidebar />

				<div className="w-full overflow-hidden flex-1 flex flex-col ">
					{/* <NavStrip user={session?.user} /> */}
					<main className="w-full p-4  overflow-hidden flex-1 mt-8 lg:mt-0">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}

export async function AdminLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const count = await getUserNotificationsCount(session?.user?.id ?? '');

	return (
		<div className="flex flex-col min-h-screen ">
			<Navbar sticky count={count?.count ?? 0} />
			<div className="flex flex-1">
				<DashboardSidebar />

				<div className="w-full overflow-hidden flex-1 flex flex-col ">
					{/* <NavStrip user={session?.user} /> */}
					<main className="w-full p-4  overflow-hidden flex-1 mt-8 lg:mt-0">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}
