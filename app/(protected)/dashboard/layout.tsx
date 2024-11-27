import { getUserNotificationsCount } from '@/actions/account/get-user-notifications-count';
import { auth } from '@/auth';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { NavStrip } from '@/components/layout/nav-strip';
import { Navbar } from '@/components/layout/navbar';
import { SessionTrackerProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const count = await getUserNotificationsCount(session?.user?.id ?? '');

	if (!session?.user) {
		redirect('/auth/login');
	}
	return (
		<SessionProvider session={session}>
			<SessionTrackerProvider>
				<Toaster />

				{children}
			</SessionTrackerProvider>
		</SessionProvider>
	);
}
