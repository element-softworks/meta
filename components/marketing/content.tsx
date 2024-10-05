'use client';

import Image from 'next/image';

interface ContentProps {
	h1?: boolean;
	title: string;
	description: string;
	image?: string;
	imageCover?: boolean;
	reverse?: boolean;
	actions?: React.ReactNode;
	priority?: boolean;
}

export function Content(props: ContentProps) {
	return (
		<section
			className={`flex flex-col-reverse gap-2 lg:gap-8 items-center ${
				props.reverse ? 'md:flex-row-reverse' : 'lg:flex-row'
			}`}
		>
			<div className="flex-1 text-start flex flex-col gap-4 w-full">
				{props.h1 ? (
					<h1 className="font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
						{props.title}
					</h1>
				) : (
					<h2 className="font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
						{props.title}
					</h2>
				)}

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
						priority={props.priority}
						loading={props.priority ? 'eager' : 'lazy'}
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
