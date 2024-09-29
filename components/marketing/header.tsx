'use client';

interface HeaderProps {
	title: string;
	highlighted?: string;
	subtitle: string;
	caption: string;
	buttons: React.ReactNode;
}

export function Header(props: HeaderProps) {
	return (
		<header className="text-start md:text-center flex flex-col gap-4 md:gap-6 md:items-center">
			<p className="text-lg md:text-xl font-medium max-w-[65ch] text-primary">
				{props.caption}
			</p>
			<h1 className="font-medium text-4xl md:text-6xl lg:text-7xl max-w-[23ch]">
				{props.title}
			</h1>

			<p className="text-base md:text-lg font-normal text-muted-foreground max-w-[65ch]">
				{props.subtitle}
			</p>
			<div className="flex gap-2 md:gap-4 flex-wrap  md:justify-center">{props.buttons}</div>
		</header>
	);
}
