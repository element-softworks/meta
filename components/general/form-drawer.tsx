'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Separator } from '../ui/separator';
import { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarProvider } from '../ui/sidebar';

interface FormDrawerProps {
	title?: string;
	description?: string;
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
export default function FormDrawer(props: FormDrawerProps) {
	const isMobile = useBreakpoint('md');

	useEffect(() => {
		if (props.open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [props.open]);
	return (
		<SidebarProvider
			className={`fixed inset-0 z-[999] ${
				props.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
			} transition-opacity`}
			open={props.open}
			onOpenChange={props.onOpenChange}
		>
			{!isMobile ? (
				<div
					className={`fixed inset-0 z-[999] bg-black bg-opacity-50 ${
						props.open ? 'opacity-100' : 'opacity-0 pointer-events-none'
					} transition-opacity`}
					onClick={() => props.onOpenChange(false)}
				></div>
			) : null}
			<Sidebar className="z-[1000] " side="right">
				<SidebarContent className="p-4 pb-0">
					{!!props.title?.length ? (
						<p className="font-medium text-xl">{props.title}</p>
					) : null}
					{!!props.description?.length ? (
						<p className="text-muted-foreground">{props.description}</p>
					) : null}
					{!!props.title?.length || !!props.description?.length ? (
						<div>
							<Separator className=" my-2" />
						</div>
					) : null}
					{props.children}
				</SidebarContent>
				<SidebarFooter></SidebarFooter>
			</Sidebar>
		</SidebarProvider>
	);
}
