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
	prefetch?: boolean;
	onClick?: () => void;
}
export function SidebarItem(props: SidebarItemProps) {
	const { prefetch = true } = props;
	const pathName = usePathname();

	const isActive = pathName === props.link;
	return (
		<Link
			href={props.link}
			prefetch={prefetch}
			onClick={() => props?.onClick?.()}
			className="h-9"
		>
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
	mobile?: boolean;
	hideOnMobile?: boolean;
}
export function SidebarGroup(props: SidebarGroupProps) {
	const { visible = true } = props;
	if (!visible) return null;
	return (
		<>
			<Accordion
				defaultChecked
				className={`${
					props.mobile && !props.hideOnMobile ? 'md:hidden block' : 'hidden md:block'
				}`}
				type="single"
				defaultValue="item-1"
				collapsible
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="text-xs text-muted-foreground font-semibold uppercase">
						{props.text}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-1">
						{props.children}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}

export function Sidebar({ children }: { children: React.ReactNode }) {
	return (
		<aside
			className={`w-0 md:w-[270px] min-h-full border-border transition-all px-0 py-6 md:p-6 md:border-r`}
		>
			<div className="flex flex-col gap-2 flex-1">{children}</div>
		</aside>
	);
}
