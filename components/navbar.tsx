'use client';
import { useCurrentUser } from '@/hooks/use-current-user';
import { CrossIcon, FrameIcon, MenuIcon, XIcon } from 'lucide-react';
import { UserButton } from './auth/user-button';
import { Button } from './ui/button';
import Link from 'next/link';
import { useState } from 'react';

const NAVBAR_ITEMS = [
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Docs', href: '/docs' },
];

export function Navbar() {
	const user = useCurrentUser();

	const [navOpen, setNavOpen] = useState(false);

	return (
		<nav className="py-6 px-8 flex flex-row justify-between items-center h-24">
			<div className="z-10 flex items-center text-lg font-light">
				<FrameIcon className="mr-2" size={30} />
				NextJS SaaS Boilerplate
			</div>

			<Button onClick={() => setNavOpen((prev) => !prev)} variant="link">
				{navOpen ? (
					<XIcon className="md:hidden" size={30} />
				) : (
					<MenuIcon className="md:hidden" size={30} />
				)}
			</Button>

			<div className="md:flex items-center gap-10 hidden">
				<div className="flex ">
					{NAVBAR_ITEMS.map((item, index) => {
						return (
							<Button
								size="lg"
								key={index}
								asChild
								variant="link"
								className="px-4 text-md font-medium"
							>
								<Link href={item.href}>{item.name}</Link>
							</Button>
						);
					})}
				</div>
				<UserButton user={user} />
			</div>
		</nav>
	);
}
