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

export type SideBarItem =
	| {
			text: string;
			link: string;
			icon?: React.ReactNode;
			visible: boolean;
			active?: boolean;
			children?:
				| {
						text: string;
						active?: boolean;
						link: string;
						icon?: React.ReactNode;
						visible: boolean;
				  }[]
				| undefined;
	  }[]
	| undefined;

export interface SidebarItemProps {
	size?: 'sm' | 'md';
	link: string;
	text: string;
	icon?: React.ReactNode;
	prefetch?: boolean;
	onClick?: () => void;
	nested?: SideBarItem;
	active?: boolean;
}
export function SidebarItem(props: SidebarItemProps) {
	const { prefetch = true } = props;
	const pathName = usePathname();

	const isActive = props.active ?? pathName === props.link;

	return (
		<div
			onClick={(e) => {
				e.preventDefault();
				props?.onClick?.();
			}}
		>
			<Link href={props.link} prefetch={prefetch} className="h-9">
				<Button
					size="sm"
					className={`w-full  justify-start px-4 flex items-center gap-2 ${
						isActive && 'font-bold'
					} 
					${props.size === 'sm' ? 'text-[0.8rem] h-7 font-normal' : 'text-sm'}
					`}
					variant={isActive ? 'default' : 'ghost'}
				>
					{props.icon}
					{props.text}
				</Button>
			</Link>
			{props.nested && (
				<div className="pl-4">
					{props.nested.map((child) => (
						<SidebarItem
							size="sm"
							key={child.link}
							link={child.link}
							text={child.text}
							icon={child.icon}
							nested={child.children}
							active={child.active}
						/>
					))}
				</div>
			)}
		</div>
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
					props.mobile && !props.hideOnMobile ? 'lg:hidden block' : 'hidden lg:block'
				} `}
				type="single"
				defaultValue="item-1"
				collapsible
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="text-xs py-2 text-muted-foreground font-semibold uppercase">
						{props.text}
					</AccordionTrigger>
					<AccordionContent className="flex flex-col pb-2">
						{props.children}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}

export function Sidebar({ children, fixed }: { children: React.ReactNode; fixed?: boolean }) {
	return (
		<aside
			style={{}}
			className={`w-0 lg:w-[270px]  border-border transition-all px-0 py-3 lg:px-4 lg:border-r`}
		>
			<div
				className={`flex flex-col flex-1 ${
					fixed && 'overflow-auto fixed top-24 left-0 w-0 lg:w-[270px] px-0 py-6 lg:p-4'
				}`}
			>
				{children}
			</div>
		</aside>
	);
}
