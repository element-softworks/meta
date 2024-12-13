'use client';
import './styles.scss';

interface RichTextRendererProps {
	content?: string;
}
export function RichTextRenderer(props: RichTextRendererProps) {
	return (
		<div
			className="max-w-[65ch] flex flex-col gap-4"
			dangerouslySetInnerHTML={{ __html: props?.content ?? '' }}
		/>
	);
}
