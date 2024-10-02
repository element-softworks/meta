'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { FrameIcon } from 'lucide-react';

export function Footer() {
	const FOOTER_COLUMNS = [
		{
			title: 'Company',
			links: [
				{ title: 'About', href: '/about' },
				{ title: 'Contact', href: '/contact' },
				{ title: 'Careers', href: '/careers' },
			],
		},
		{
			title: 'Product',
			links: [
				{ title: 'Features', href: '/features' },
				{ title: 'Pricing', href: '/pricing' },
				{ title: 'Documentation', href: '/docs' },
			],
		},
		{
			title: 'Social',
			links: [
				{ title: 'GitHub', href: 'https://github.com' },
				{ title: 'Twitter', href: 'https://twitter.com' },
				{ title: 'LinkedIn', href: 'https://linkedin.com' },
			],
		},
	];
	return (
		<footer className="border-t border-border">
			<div className="flex md:flex-row flex-col gap-10 md:gap-20 lg:gap-40 container px-4 pt-10 md:pt-20 pb-12">
				<Link href="/" aria-label="Go to homepage">
					<div className=" flex items-center text-lg font-light z-[200] relative flex-nowrap">
						<FrameIcon className="mr-2" size={30} />
						<p className="whitespace-nowrap">NextJS SaaS Boilerplate</p>
					</div>
				</Link>
				<div className=" grid grid-cols-2 lg:grid-cols-3 gap-10 w-full">
					{FOOTER_COLUMNS.map((column, index) => (
						<div key={index}>
							<p className="font-semibold">{column.title}</p>
							<div className="flex flex-col gap-1 mt-4">
								{column.links.map((link, index) => (
									<Link key={index} href={link.href}>
										<Button variant="link" className="p-0 h-fit">
											{link.title}
										</Button>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="container px-4 pb-10 md:pb-20 pt-12 border-t border-border">
				<div className="flex gap-0 lg:gap-10 lg:flex-row flex-col">
					<p className="text-sm">
						&copy; {new Date().getFullYear()} NextJS SaaS Boilerplate. All rights
						reserved
					</p>
					<p className="text-sm flex-1">Company No. 123456789</p>

					<div className="flex gap-6 lg:gap-10 mt-4 md:mt-0">
						<Link href="/privacy-policy">
							<Button className="px-0" variant="link">
								Privacy Policy
							</Button>
						</Link>
						<Link href="/terms-and-conditions">
							<Button className="px-0" variant="link">
								Terms & Conditions
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
