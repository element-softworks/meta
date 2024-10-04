'use client';

import Marquee from 'react-fast-marquee';

interface MarqueeTextProps {
	text: string[];
	direction: 'left' | 'right' | 'up' | 'down';
}

export function MarqueeText(props: MarqueeTextProps) {
	return (
		<Marquee autoFill direction={props.direction} speed={20} className="h-12 md:h-20">
			{props.text?.map((text, index) => {
				const isEven = index % 2 === 0;
				return (
					<p
						key={index}
						className={`text-3xl md:text-4xl lg:text-6xl mx-4 md:mx-8 ${
							isEven ? 'text-muted-foreground' : ''
						}`}
					>
						{text}
					</p>
				);
			})}
		</Marquee>
	);
}
