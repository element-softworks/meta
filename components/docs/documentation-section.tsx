'use client';

interface DocsProps {
	children: React.ReactNode;
	id: string;
}
export function DocumentationSection(props: DocsProps) {
	return (
		<section className="pb-20 border-b border-border docs-section" id={props.id}>
			{props.children}
		</section>
	);
}
