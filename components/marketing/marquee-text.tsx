'use client';

import Marquee from 'react-fast-marquee';

interface MarqueeTextProps {
	text: string[];
	direction: 'left' | 'right' | 'up' | 'down';
}

export function MarqueeText(props: MarqueeTextProps) {
	return (
		<Marquee autoFill gradient direction={props.direction}>
			{props.text?.map((text, index) => {
				const isEven = index % 2 === 0;
				return (
					<p
						key={index}
						style={{
							color: isEven ? 'black' : 'white',
							backgroundColor: isEven ? 'transparent' : 'white',
							textShadow: isEven
								? undefined
								: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
						}}
						className="font-extrabold text-3xl md:text-4xl lg:text-6xl mx-4 md:mx-8"
					>
						{text}
					</p>
				);
			})}
		</Marquee>
	);
}
