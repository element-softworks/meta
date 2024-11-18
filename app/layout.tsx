import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Fredoka, Inter, Open_Sans } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/marketing/footer';

const fredoka = Fredoka({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-fredoka',
});
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });

export const metadata: Metadata = {
	title: 'Coaching Hours',
	description: 'This is a boilerplate for building SaaS applications with NextJS.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fredoka.variable} ${openSans.variable}`}>
				<Toaster />
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
