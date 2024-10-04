import { Navbar } from '@/components/layout/navbar';
import { SessionTrackerProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';

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
			<SessionTrackerProvider>
				<ThemeProvider>
					<Toaster />
					<div className={`flex flex-col min-h-screen mx-auto ${inter.className}`}>
						<Navbar sticky contained disableBorderBottom />

						<div className="flex flex-1 overflow-clip">
							<main className="w-full flex-1 flex flex-col ">{children}</main>
						</div>
					</div>
				</ThemeProvider>
			</SessionTrackerProvider>
		</SessionProvider>
	);
}
