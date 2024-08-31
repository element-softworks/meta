'use client';
import { useEffect, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config';

export const useBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
	const [isBreakpoint, setIsBreakpoint] = useState(false);

	const fullConfig = resolveConfig(tailwindConfig);
	const breakPoint = fullConfig.theme.screens?.[breakpoint]?.split('px')[0];

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < Number(breakPoint)) {
				setIsBreakpoint(true);
			} else {
				setIsBreakpoint(false);
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [breakpoint]);

	return isBreakpoint;
};
