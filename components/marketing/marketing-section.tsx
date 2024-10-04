'use client';

import React from 'react';

interface MarketingSectionProps {
	id?: string;
	children: React.ReactNode;
	disablePaddingTop?: boolean;
	disableContainer?: boolean;
	disablePaddingX?: boolean;
	disablePaddingBottom?: boolean;
	className?: string;
	fadeSides?: boolean;
}
export function MarketingSection(props: MarketingSectionProps) {
	return (
		<section
			id={props.id}
			className={`mx-auto text-center py-12 md:py-28 
			${props.disablePaddingX ? 'px-0' : ''}
			${props.disableContainer ? '' : 'container'}
			${props.disablePaddingTop ? '!pt-0' : ''} ${props.disablePaddingBottom ? '!pb-0' : ''}
			${props.className}`}
			style={
				props.fadeSides
					? {
							WebkitMaskImage:
								'linear-gradient(to right, rgba(0, 0, 0, 0) 4%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 96%)',
							maskImage:
								'linear-gradient(to right, rgba(0, 0, 0, 0) 4%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 96%)',
					  }
					: {}
			}
		>
			{props.children}
		</section>
	);
}
