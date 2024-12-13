import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
	return {
		title: `Meta Retail Manager`,
		description:
			'Centralised platform for store management, fixture assessments, and real-time metrics with robust issue tracking and actionable insights.',
		openGraph: {
			title: `Meta Retail Manager`,
			description:
				'Centralised platform for store management, fixture assessments, and real-time metrics with robust issue tracking and actionable insights.',
		},
		twitter: {
			title: `Meta Retail Manager`,
			description:
				'Centralised platform for store management, fixture assessments, and real-time metrics with robust issue tracking and actionable insights.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}`,
		},
	};
}

export default function NotFound() {
	return (
		<>
			<SessionProvider>
				<Navbar />
				<section className="min-h-[91vh] flex items-center justify-center flex-col gap-4 lg:gap-8 text-center container">
					<h1 className="font-medium text-3xl sm:text-4xl md:text-6xl lg:text-7xl max-w-[22ch]">
						Page not found
					</h1>
					<p className="text-base lg:text-lg">Could not find requested resource</p>
					<Link href="/">
						<Button size="lg">Return home</Button>
					</Link>
				</section>
			</SessionProvider>
		</>
	);
}
