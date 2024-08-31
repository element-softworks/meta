'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Button } from '../ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface SidebarItemProps {
	link: string;
	text: string;
	icon?: React.ReactNode;
}
export function SidebarItem(props: SidebarItemProps) {
	const pathName = usePathname();

	const isActive = pathName === props.link;
	return (
		<Link href={props.link}>
			<Button
				size="lg"
				className="w-full justify-start px-4 flex items-center gap-2"
				variant={isActive ? 'default' : 'ghost'}
			>
				{props.icon}
				{props.text}
			</Button>
		</Link>
	);
}

export function Sidebar({ children }: { children: React.ReactNode }) {
	const isMobile = useBreakpoint('md');

	return (
		<aside
			className={`${isMobile ? 'w-0' : 'w-[360px]'} bg-white border-border transition-all ${
				isMobile ? 'px-0 py-6' : 'p-6 border-r'
			} `}
		>
			<div className="flex flex-col gap-2">{children}</div>
		</aside>
	);
}
