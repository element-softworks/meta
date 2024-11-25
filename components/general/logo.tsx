'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

interface LogoProps {
	width: number;
	height: number;
}
export function Logo(props: LogoProps) {
	const { theme } = useTheme();

	return (
		<>
			<Image
				src={'/meta-logos/positive-primary/RGB/Meta_lockup_positive primary_RGB.svg'}
				alt="Coaching hours logo"
				width={props.width}
				height={props.height}
				className="dark:hidden -ml-4"
			/>
			<Image
				src={
					'/public/meta-logos/negative-primary/RGB/Meta_lockup_negative primary_white_RGB.svg'
				}
				alt="Coaching hours logo"
				width={props.width}
				height={props.height}
				className="hidden dark:block -ml-4"
			/>
		</>
	);
}
