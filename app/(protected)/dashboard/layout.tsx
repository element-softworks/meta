import { auth } from '@/auth';
import { CreateTeamDialog } from '@/components/dialogs/create-team-dialog';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { NavStrip } from '@/components/layout/nav-strip';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/toaster';
import { getCookie } from '@/data/cookies';
import { SessionProvider } from 'next-auth/react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const hasCreateCookie = await getCookie(`${session?.user.email}-create-team-dialog`);

	return (
		<SessionProvider session={session}>
			<Toaster />
			<div className="flex flex-col min-h-screen ">
				<Navbar />
				<div className="border-t border-border flex flex-1">
					<DashboardSidebar />
					<CreateTeamDialog hasCreateCookie={!!hasCreateCookie} />

					<div className="w-full overflow-hidden flex-1 flex flex-col">
						<NavStrip user={session?.user} />
						<main className="w-full p-4 md:p-6 overflow-hidden flex-1">{children}</main>
					</div>
				</div>
			</div>
		</SessionProvider>
	);
}
