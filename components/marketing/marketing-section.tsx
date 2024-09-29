'use client';

import React from 'react';

interface MarketingSectionProps {
	children: React.ReactNode;
	disablePaddingTop?: boolean;
	disableContainer?: boolean;
	disablePaddingX?: boolean;
	disablePaddingBottom?: boolean;
	className?: string;
}
export function MarketingSection(props: MarketingSectionProps) {
	return (
		<section
			className={`mx-auto text-center py-12 md:py-32 
			${props.disablePaddingX ? '' : 'px-4'}
			${props.disableContainer ? '' : 'container'}
			${props.disablePaddingTop ? '!pt-0' : ''} ${props.disablePaddingBottom ? '!pb-0' : ''}
			${props.className}`}
		>
			{props.children}
		</section>
	);
}
