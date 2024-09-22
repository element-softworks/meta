'use client';

interface DocsProps {
	children: React.ReactNode;
	id: string;
}
export function DocumentationSection(props: DocsProps) {
	return (
		<section className="pb-10 border-b border-border" id={props.id}>
			{props.children}
		</section>
	);
}
