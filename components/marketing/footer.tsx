'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../general/logo';

export function Footer() {
	const FOOTER_COLUMNS = [
		{
			title: 'Company',
			links: [
				{ title: 'Home', href: '/' },
				{ title: 'About', href: '/' },
				{ title: 'Insights', href: '/' },
			],
		},
		{
			title: 'Dashboard',
			links: [
				{ title: 'For coachees', href: '/auth/register' },
				{ title: 'For coaches', href: '/auth/coach-setup' },
				{ title: 'Register interest', href: '/' },
			],
		},
		{
			title: 'Contact',
			links: [
				{ title: 'Contact us', href: '/#contact-us' },
				{ title: 'Instagram', href: '/#instagram' },
				{ title: 'LinkedIn', href: '/#linkedin' },
			],
		},
		{
			title: 'Legal',
			links: [
				{ title: 'Terms and conditions', href: '/terms-of-service' },
				{ title: 'Privacy policy', href: '/privacy-policy' },
			],
		},
	];
	return (
		<footer className="border-t border-border bg-primary-foreground">
			<div className="flex md:flex-row flex-col gap-10 md:gap-20 lg:gap-40 container pt-10 md:pt-20 pb-12">
				<div>
					<Link href="/dashboard" aria-label="Go to homepage">
						<Logo width={150} height={50} />
					</Link>
					<p className="text-xs sm:text-nowrap text-secondary-foreground mt-2">
						Copyright {new Date().getFullYear()}-{Number(new Date().getFullYear()) + 1}.
						Coaching Hours Ltd #14879225
					</p>
				</div>
				<div className=" grid grid-cols-2 lg:grid-cols-4 gap-10 w-full">
					{FOOTER_COLUMNS.map((column, index) => (
						<div key={index}>
							<p className="font-bold font-display">{column.title}</p>
							<div className="flex flex-col gap-2.5 mt-2">
								{column.links.map((link, index) => (
									<Link
										key={index}
										href={link.href}
										className="text-sm font-normal text-foreground hover:text-primary"
									>
										{link.title}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</footer>
	);
}
