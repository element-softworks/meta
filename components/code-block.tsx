'use client';

import { CodeBlock as Block } from 'react-code-block';

interface CodeBlockProps {
	code: string;
	language: string;
	enableLineNumbers?: boolean;
	lines?: (number | string)[];
}
export function CodeBlock(props: CodeBlockProps) {
	return (
		<Block code={props.code} language={props.language} lines={props.lines}>
			<Block.Code className="bg-gray-900 py-6 rounded-xl shadow-lg">
				{({ isLineHighlighted }) => (
					<div
						className={`table-row ${
							isLineHighlighted
								? 'bg-violet-500/20'
								: !!props.lines?.length
								? 'opacity-60'
								: ''
						}`}
					>
						{props.enableLineNumbers && (
							<Block.LineNumber
								className={`table-cell pl-6 pr-4 text-sm text-right select-none ${
									isLineHighlighted ? 'text-gray-300' : 'text-gray-500'
								}`}
							/>
						)}
						<Block.LineContent
							className={`table-cell w-full pr-6 ${!props.lines && 'pl-4'}`}
						>
							<Block.Token />
						</Block.LineContent>
					</div>
				)}
			</Block.Code>
		</Block>
	);
}
