'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { m, useScroll, useTransform, LazyMotion, domAnimation } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface ParallaxContentProps {
	title: string;
	description: string;
	image: string;
	imageCover?: boolean;
	reverse?: boolean;
	actions?: React.ReactNode;
	className?: string;
}

export function ParallaxContent(props: ParallaxContentProps) {
	const $scrollTarget = useRef(null);
	const { scrollYProgress } = useScroll({
		target: $scrollTarget,
		offset: ['start end', 'end end'], // This offsets the scroll position
	});
	const isMobile = useBreakpoint('lg');
	const scrollInOut = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [200, 0, 0, -200]);
	const opacityInOut = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0, 1, 1, 0]);
	const imageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
	const imageScrollOut = useTransform(
		scrollYProgress,
		[0, 0, 0.55, 1],
		[0, 0, 0, isMobile ? -200 : -100]
	);

	return (
		<LazyMotion features={domAnimation}>
			<section ref={$scrollTarget} className={`h-[150vh]  ${props.className}`}>
				<div className="sticky top-1/2 -translate-y-1/2">
					<div className="relative">
						<section
							className={`flex flex-col-reverse gap-2 sm:gap-8 items-center ${
								props.reverse ? 'md:flex-row-reverse' : 'lg:flex-row'
							}`}
						>
							<m.div
								className={`flex-1 text-start flex flex-col gap-4 w-full `}
								style={{ y: scrollInOut, opacity: opacityInOut }}
							>
								<h2 className="font-semibold text-2xl md:text-4xl lg:text-5xl max-w-[22ch]">
									{props.title}
								</h2>

								<p className="text-base md:text-lg font-normal text-muted-foreground max-w-[65ch]">
									{props.description}
								</p>

								{props.actions}
							</m.div>

							<m.div
								style={{ opacity: imageOpacity, y: imageScrollOut }}
								className="flex-1 rounded-2xl border-2   border-border w-full"
							>
								<Image
									src={props.image}
									alt={`${props.title} image`}
									width={1000}
									height={600}
									className={`rounded-2xl h-full w-full ${
										props.imageCover ? 'object-cover' : 'object-contain'
									}`}
								/>
							</m.div>
						</section>
					</div>
				</div>
			</section>
		</LazyMotion>
	);
}
