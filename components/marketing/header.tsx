'use client';

import React from 'react';

interface HeaderProps {
	title: string;
	highlighted: string;
	subtitle: string;
	caption: string;
	buttons: React.ReactNode;
}

export function Header(props: HeaderProps) {
	const splitTitle = props.title.split(props.highlighted);
	return (
		<header className="text-start md:text-center flex flex-col gap-4 md:gap-6 md:items-center">
			<p className="text-lg md:text-xl font-medium max-w-[65ch] text-primary/60">
				{props.caption}
			</p>
			<h1 className="font-medium text-4xl md:text-6xl lg:text-7xl max-w-[22ch]">
				{splitTitle?.map((part, index) => (
					<React.Fragment key={index}>
						{part}
						{index !== splitTitle.length - 1 && (
							<span className="text-primary font-extrabold">{props.highlighted}</span>
						)}
					</React.Fragment>
				))}
			</h1>

			<p className="text-base md:text-lg font-normal text-muted-foreground max-w-[65ch]">
				{props.subtitle}
			</p>
			<div className="flex gap-2 md:gap-4 flex-wrap  md:justify-center">{props.buttons}</div>
		</header>
	);
}
