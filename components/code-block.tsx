'use client';

import { CodeBlock as Block } from 'react-code-block';

interface CodeBlockProps {
	code: string;
	language: string;
	enableLineNumbers?: boolean;
}
export function CodeBlock(props: CodeBlockProps) {
	return (
		<Block code={props.code} language={props.language}>
			<Block.Code className="bg-gray-900 p-6 rounded-xl shadow-lg">
				<div className="table-row">
					{props.enableLineNumbers && (
						<Block.LineNumber className="table-cell pr-4 text-sm text-gray-500 text-right select-none" />
					)}
					<Block.LineContent className="table-cell">
						<Block.Token />
					</Block.LineContent>
				</div>
			</Block.Code>
		</Block>
	);
}
