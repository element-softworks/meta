import { getUserNotificationsCount } from '@/actions/account/get-user-notifications-count';
import { auth } from '@/auth';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { NavStrip } from '@/components/layout/nav-strip';
import { Navbar } from '@/components/layout/navbar';
import { SessionTrackerProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const count = await getUserNotificationsCount(session?.user?.id ?? '');
	return (
		<SessionProvider session={session}>
			<SessionTrackerProvider>
				<Toaster />
				<div className="flex flex-col min-h-screen ">
					<Navbar count={count?.count ?? 0} />
					<div className="flex flex-1">
						<DashboardSidebar />

						<div className="w-full overflow-hidden flex-1 flex flex-col ">
							<NavStrip user={session?.user} />
							<main className="w-full p-4  overflow-hidden flex-1">{children}</main>
						</div>
					</div>
				</div>
			</SessionTrackerProvider>
		</SessionProvider>
	);
}
