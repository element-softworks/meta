'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

interface LogoProps {
	width: number;
	height: number;
	noTitle?: boolean;
}
export function Logo(props: LogoProps) {
	const { theme } = useTheme();

	return (
		<>
			<Image
				src={
					props.noTitle
						? '/meta-logos/meta-logo.svg'
						: '/meta-logos/positive-primary/RGB/Meta_lockup_positive primary_RGB.svg'
				}
				alt="Meta logo"
				width={props.width}
				height={props.height}
				className="dark:hidden "
			/>
			<Image
				src={
					props.noTitle
						? '/meta-logos/meta-logo.svg'
						: '/public/meta-logos/negative-primary/RGB/Meta_lockup_negative primary_white_RGB.svg'
				}
				alt="Meta logo"
				width={props.width}
				height={props.height}
				className="hidden dark:block"
			/>
		</>
	);
}
