import { auth, update } from '@/auth';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import '../globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';

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
			<html lang="en" suppressHydrationWarning>
				<body className={inter.className}>
					<Toaster />
					<div className="flex flex-col min-h-screen ">
						<Navbar />

						<div className="border-t border-border flex flex-1">
							<main className="w-full overflow-hidden flex-1 flex flex-col">
								{children}
							</main>
						</div>
					</div>
				</body>
			</html>
		</SessionProvider>
	);
}
