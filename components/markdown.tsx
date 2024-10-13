'use client';
import { urlFor } from '@/sanity/lib/image';
import { getImageDimensions } from '@sanity/asset-utils';
import { link } from 'fs';
import { PortableTextComponents } from 'next-sanity';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';

interface MarkdownProps {
	body: any;
}

export function Markdown(props: MarkdownProps) {
	// Barebones lazy-loaded image component
	const SampleImageComponent = ({
		value,
		isInline,
	}: {
		value: { alt: string; asset: { _ref: string } };
		isInline: boolean;
	}) => {
		console.log(value, 'value data');
		const { width, height } = getImageDimensions(value);
		return (
			<Image
				src={urlFor(value.asset).width(700).url()}
				alt={value.alt || 'Image from CMS'}
				loading="lazy"
				width={width}
				height={height}
				style={{
					// Display alongside text if image appears inside a block text span
					display: isInline ? 'inline-block' : 'block',

					// Avoid jumping around with aspect-ratio CSS property
					aspectRatio: width / height,
				}}
			/>
		);
	};

	const components: PortableTextComponents = {
		types: {
			image: SampleImageComponent,
			// Any other custom types you have in your content
			// Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
		},
		block: {
			h1: ({ children }) => (
				<h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-10">{children}</h1>
			),
			h2: ({ children }) => (
				<h2 className="font-semibold text-xl md:text-2xl lg:text-3xl mt-8">{children}</h2>
			),
			h3: ({ children }) => (
				<h3 className="font-semibold text-lg md:text-xl lg:text-2xl mt-6">{children}</h3>
			),
			h4: ({ children }) => (
				<h4 className="font-semibold text-base md:text-lg lg:text-xl mt-6">{children}</h4>
			),
			h5: ({ children }) => (
				<h5 className="font-semibold text-sm md:text-base lg:text-lg mt-4">{children}</h5>
			),
			h6: ({ children }) => (
				<h6 className="font-semibold text-xs md:text-sm lg:text-base mt-4">{children}</h6>
			),
			alert: ({ children }) => (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
					{children}
				</div>
			),

			blockquote: ({ children }) => (
				<blockquote className="border-muted-foreground border-l-4 pl-2">
					{children}
				</blockquote>
			),
		},
		list: {
			bullet: ({ children }) => <ul style={{ marginLeft: '16px' }}>{children}</ul>,
			number: ({ children }) => <ol style={{ marginLeft: '16px' }}>{children}</ol>,
		},
		listItem: {
			bullet: ({ children }) => (
				<li
					style={{
						listStyleType: 'disc',
					}}
				>
					{children}
				</li>
			),
			number: ({ children }) => (
				<li
					style={{
						listStyleType: 'decimal',
					}}
				>
					{children}
				</li>
			),
		},
	};

	return (
		<div className="flex flex-col gap-2 [&_a]:!text-primary [&_a]:!font-bold [&_a]:underline">
			<PortableText value={props.body!} components={components} />
		</div>
	);
}
