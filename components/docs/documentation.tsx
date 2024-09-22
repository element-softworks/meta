'use client';

interface DocsProps {
	children: React.ReactNode;
}
export function Documentation(props: DocsProps) {
	return (
		<main className="flex flex-col mt-8 md:mt-0 max-w-4xl scroll-smooth">{props.children}</main>
	);
}
