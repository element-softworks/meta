'use client';

import Marquee from 'react-fast-marquee';

interface MarqueeTextProps {
	text: string[];
}

export function MarqueeText(props: MarqueeTextProps) {
	return (
		<Marquee autoFill gradient>
			{props.text?.map((text, index) => {
				const isEven = index % 2 === 0;
				return (
					<p
						key={index}
						style={{
							color: 'white',
							backgroundColor: 'white',
							textShadow: isEven
								? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
								: undefined,
						}}
						className="font-extrabold text-3xl md:text-4xl lg:text-6xl mx-8"
					>
						{text}
					</p>
				);
			})}
		</Marquee>
	);
}
