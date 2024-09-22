'use client';

import { createElement } from 'react';

interface DocsProps {
	children: React.ReactNode;
	variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}
export function DocumentationTypography(props: DocsProps) {
	if (!props.variant) {
		throw new Error('Variant is required');
	}

	const variantClasses = {
		h1: 'text-3xl md:text-4xl font-semibold mt-12 mb-4 text-primary',
		h2: 'text-xl md:text-2xl font-semibold mt-10 mb-2 text-primary',
		h3: 'text-lg md:text-xl font-semibold mt-6 mb-2 text-primary',
		h4: 'text-base md:text-lg font-semibold mt-4 mb-2 text-primary',
		h5: 'text-sm md:text-base font-semibold mt-1 mb-1 text-primary',
		h6: 'text-xl md:text-sm font-semibold mt-1 mb-1 text-primary',
		p: 'mt-4 mb-4',
	};

	const node = createElement(
		props.variant,
		{ className: variantClasses[props.variant] },
		props.children
	);

	return node;
}
