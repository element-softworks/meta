import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Fredoka, Inter, Open_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/marketing/footer';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Meta',
	description: 'This is a boilerplate for building SaaS applications with NextJS.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${inter.variable} `}>
			<body>
				<Toaster />
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
