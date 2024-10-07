'use client';
import { Card } from '@/components/ui/card';
import { urlFor } from '@/sanity/lib/image';
import { Post } from '@/sanity/sanity.types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export function PostCard({ post }: { post: Post }) {
	return (
		<Card className="transition-transform duration-300 hover:scale-105">
			<Link href={`/blog/${post.slug?.current}`} className="block h-full flex flex-col">
				<div className="relative h-48 w-full">
					{!!post?.mainImage && (
						<Image
							className="rounded-tr-md rounded-tl-md"
							alt={post.mainImage?.alt ?? 'Blog image'}
							src={urlFor(post.mainImage).width(600).url()}
							layout="fill"
							objectFit="cover"
						/>
					)}
				</div>

				<div className="px-6 pt-4 pb-6 flex flex-col gap-2 ">
					<p className="text-base font-semibold">{post.title}</p>
					<p className="text-muted-foreground text-sm line-clamp-3 ">{post.excerpt}</p>

					<div className="flex flex-1 gap-2 items-center ">
						{!!post?.author?.image && (
							<div className="relative size-6 rounded-full">
								<Image
									className="rounded-full"
									alt={post.mainImage?.alt ?? 'Author image'}
									src={urlFor(post.author.image).width(100).url()}
									layout="fill"
									objectFit="cover"
								/>
							</div>
						)}
						<div>
							<p className="text-xs font-semibold">{post?.author?.name ?? ''}</p>
							<p className="text-xs text-muted-foreground">
								{format(new Date(post._createdAt), 'dd/MM/yyyy')}
							</p>
						</div>
					</div>
				</div>
			</Link>
		</Card>
	);
}
