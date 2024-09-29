'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import EmblaCarousel, { EmblaCarouselType } from 'embla-carousel';
import Image from 'next/image';
import { useEffect } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];

interface MarketingSliderProps {
	basis?: string;
	priority?: boolean;
	options?: CarouselOptions;
	slides: {
		image: string;
		alt: string;
	}[];
	carouselOnMobile?: boolean;
}
export function MarketingSlider(props: MarketingSliderProps) {
	//We default to no carousel on mobile because it's bad for core web vitals
	const { carouselOnMobile = false } = props;
	const isMobile = useBreakpoint('md');

	return (
		<>
			<div
				className={`relative flex justify-center max-w-[2300px] p-4 xl:p-0 ${
					carouselOnMobile ? '' : 'hidden md:block'
				}`}
				style={
					isMobile
						? {}
						: {
								WebkitMaskImage:
									'linear-gradient(to right, rgba(0, 0, 0, 0) 4%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 96%)',
								maskImage:
									'linear-gradient(to right, rgba(0, 0, 0, 0) 4%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, rgba(0, 0, 0, 0) 96%)',
						  }
				}
			>
				<Carousel
					className="w-full"
					opts={{
						...props.options,
					}}
					plugins={[
						Autoplay({
							delay: 7000,
							playOnInit: true,
							stopOnInteraction: true,
						}),
					]}
				>
					<CarouselContent>
						{props.slides.map((slide, index) => (
							<CarouselItem
								key={index}
								className={`${!!props.basis?.length ? props.basis : 'basis-1/3'}`}
							>
								<div className="p-1 rounded-2xl border-2 border-border">
									<Image
										priority={props.priority}
										loading={props.priority ? 'eager' : 'lazy'}
										className="rounded-xl"
										src={slide.image}
										alt={slide.alt}
										layout="responsive"
										width={1200}
										height={800}
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					{/* <CarouselPrevious /> */}
					{/* <CarouselNext /> */}
				</Carousel>
			</div>
		</>
	);
}
