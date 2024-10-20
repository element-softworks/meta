'use client';

import { useState } from 'react';

interface TooltipProps {
	text: string | React.ReactNode;
	className?: string;
	children: React.ReactNode;
}
export default function Tooltip(props: TooltipProps) {
	const [show, setShow] = useState(false);
	return (
		<div className={`relative`}>
			{!!props.text && (
				<div
					className={`opacity-0 cursor-default bg-primary rounded-md transition-all absolute ${
						show && 'opacity-100'
					} ${props.className}`}
				>
					<p className="text-xs text-primary-foreground p-2">{props.text}</p>
				</div>
			)}
			<div onMouseOver={() => setShow(true)} onMouseLeave={() => setShow(false)}>
				{props.children}
			</div>
		</div>
	);
}
