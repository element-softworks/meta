'use client';

import { CodeBlock as Block } from 'react-code-block';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { useEffect, useState } from 'react';
import { Check, Clipboard } from 'lucide-react';

interface CodeBlockProps {
	code: string;
	language: string;
	enableLineNumbers?: boolean;
	lines?: (number | string)[];
	copyToClipboard?: boolean;
}
export function CodeBlock(props: CodeBlockProps) {
	const { copyToClipboard = true } = props;
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (copied) {
			const timer = setTimeout(() => {
				setCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [copied]);
	return (
		<Block code={props.code} language={props.language} lines={props.lines}>
			<div className="relative">
				<Block.Code className="bg-gray-900 py-6 rounded-xl shadow-lg overflow-auto">
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
				{copyToClipboard ? (
					<Button
						aria-label="Copy code to clipboard"
						size="icon"
						variant="default"
						className=" absolute top-2 right-2"
						onClick={() => {
							setCopied(true);
							navigator.clipboard.writeText(props.code);
						}}
					>
						{copied ? <Check size={20} /> : <Clipboard size={20} />}
					</Button>
				) : null}
			</div>
		</Block>
	);
}
