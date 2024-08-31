'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';

export function Sidebar() {
	const isMobile = useBreakpoint('md');

	return (
		<aside
			className={`${
				isMobile ? 'w-0' : 'w-[360px]'
			} bg-white border-r border-border transition-all`}
		></aside>
	);
}
