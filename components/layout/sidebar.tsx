'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

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
				className={`w-full justify-start px-4 flex items-center gap-2 ${
					isActive && 'font-bold'
				} `}
				variant={isActive ? 'secondary' : 'ghost'}
			>
				{props.icon}
				{props.text}
			</Button>
		</Link>
	);
}

export interface SidebarGroupProps {
	text: string;
	children?: React.ReactNode;
	visible?: boolean;
}
export function SidebarGroup(props: SidebarGroupProps) {
	const isMobile = useBreakpoint('md');

	const { visible = true } = props;
	if (!visible || isMobile) return null;
	return (
		<>
			<Accordion type="multiple" defaultValue={['item-1']}>
				<AccordionItem value="item-1">
					<AccordionTrigger className="text-xs text-muted-foreground font-semibold uppercase">
						{props.text}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-2">
						{props.children}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}

export function Sidebar({ children }: { children: React.ReactNode }) {
	const isMobile = useBreakpoint('md');

	return (
		<aside
			className={`${
				isMobile ? 'w-0' : 'w-[360px]'
			} min-h-full border-border transition-all  ${isMobile ? 'px-0 py-6' : 'p-6 border-r'}`}
		>
			<div className="flex flex-col gap-2 flex-1">{children}</div>
		</aside>
	);
}
