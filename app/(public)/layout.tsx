import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Navbar } from '@/components/layout/navbar';
import { getUserNotificationsCount } from '@/actions/get-user-notifications-count';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'NextJS SaaS Boilerplate',
	description: 'This is a boilerplate for building SaaS applications with NextJS.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<Toaster />
			<div className={`flex flex-col min-h-screen ${inter.className}`}>
				<Navbar sticky />

				<div className="flex flex-1">
					<main className="w-full overflow-hidden flex-1 flex flex-col">{children}</main>
				</div>
			</div>
		</SessionProvider>
	);
}
