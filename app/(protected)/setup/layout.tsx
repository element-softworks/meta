import { getUserNotificationsCount } from '@/actions/get-user-notifications-count';
import { auth } from '@/auth';
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
						<main className="w-full p-4  overflow-hidden flex items-center justify-center">
							{children}
						</main>
					</div>
				</div>
			</SessionTrackerProvider>
		</SessionProvider>
	);
}
