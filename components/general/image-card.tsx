'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export interface ImageCardProps {
	title: string | React.ReactNode;
	subtitle: string;
	endIcon?: React.ReactNode;
	image: string;
	link: string;
}

export function ImageCard(props: ImageCardProps) {
	const { theme } = useTheme();

	return (
		<Link
			href={`${props.link}`}
			className="relative rounded-md aspect-[4.5/3] hover:scale-[102%] bg-background border"
		>
			<div
				className={`${
					theme === 'light' ? 'fade-gradient-light' : 'fade-gradient'
				} absolute top-0 left-0 w-full h-full z-10 rounded-sm`}
			/>
			<Image
				unoptimized
				className={`${
					theme === 'light' ? 'fade-gradient-light' : 'fade-gradient'
				} rounded-tr-md rounded-tl-md aspect-[4/2] object-cover`}
				src={props.image}
				layout="responsive"
				width={0}
				height={0}
				alt={`${props.title} image`}
			></Image>

			<div className="w-full p-4 py-3 gap-2 flex flex-row z-20 rounded-md ">
				<div className="mt-auto h-full flex items-end w-full  gap-2">
					<div className="flex gap-2 items-center flex-1 ">
						<div className="flex-1">
							<div className="mt-auto font-semibold text-base text-foreground line-clamp-1">
								{props.title ? (
									typeof props.title === 'string' ? (
										<p>{props.title}</p>
									) : (
										props.title
									)
								) : null}
							</div>
							<div className="text-sm text-muted-foreground line-clamp-1">
								{props.subtitle ? (
									<p className="font-medium">{props.subtitle}</p>
								) : null}
							</div>
						</div>
						{props.endIcon ? <div>{props.endIcon}</div> : null}
					</div>
				</div>
			</div>
		</Link>
	);
}
