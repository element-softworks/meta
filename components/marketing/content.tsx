'use client';

import Image from 'next/image';

interface ContentProps {
	title: string;
	description: string;
	image?: string;
	imageCover?: boolean;
	reverse?: boolean;
	actions?: React.ReactNode;
}

export function Content(props: ContentProps) {
	return (
		<section
			className={`flex flex-col-reverse gap-2 lg:gap-8 items-center ${
				props.reverse ? 'md:flex-row-reverse' : 'lg:flex-row'
			}`}
		>
			<div className="flex-1 text-start flex flex-col gap-4 w-full">
				<h2 className="font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
					{props.title}
				</h2>

				{!!props.description ? (
					<p className="text-base md:text-lg font-normal text-muted-foreground max-w-[65ch]">
						{props.description}
					</p>
				) : null}

				{props.actions}
			</div>

			{!!props.image?.length ? (
				<div className="flex-1 rounded-2xl border-2 border-border w-full">
					<Image
						src={props.image}
						alt={`${props.title} image`}
						width={1000}
						height={600}
						className={`rounded-2xl h-full w-full ${
							props.imageCover ? 'object-cover' : 'object-contain'
						}`}
					/>
				</div>
			) : null}
		</section>
	);
}
