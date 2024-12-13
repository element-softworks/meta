'use client';
import './styles.scss';

interface RichTextRendererProps {
	content?: string;
}
export function RichTextRenderer(props: RichTextRendererProps) {
	return <div dangerouslySetInnerHTML={{ __html: props?.content ?? '' }} />;
}
