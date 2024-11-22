'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import logo from '/coaching-hours-primary-text.svg';

interface LogoProps {
	width: number;
	height: number;
}
export function Logo(props: LogoProps) {
	const { theme } = useTheme();

	return (
		<>
			<Image
				src={'/coaching-hours-primary-text.svg'}
				alt="Coaching hours logo"
				width={props.width}
				height={props.height}
				className="dark:hidden -ml-4"
			/>
			<Image
				src={'/coaching-hours-text-white-logo.svg'}
				alt="Coaching hours logo"
				width={props.width}
				height={props.height}
				className="hidden dark:block -ml-4"
			/>
		</>
	);
}
