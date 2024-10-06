import { boilerplateConfig } from '@/boilerplate.config';
import { ClientInfiniteScroll } from '@/components/ClientInfiniteScroll';
import { Card } from '@/components/ui/card';
import { getPosts } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Post } from '@/sanity/sanity.types';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

//This component is SSR due to pagination needing dynamic params data

export async function generateMetadata() {
	return {
		title: `Blog | ${boilerplateConfig.projectName}`,
		description: 'Read the latest articles from our blog.',
		openGraph: {
			title: `Blog | ${boilerplateConfig.projectName}`,
			description: 'Read the latest articles from our blog.',
		},
		twitter: {
			title: `Blog | ${boilerplateConfig.projectName}`,
			description: 'Read the latest articles from our blog.',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
		},
	};
}

export default async function Blog({
	searchParams,
}: {
	searchParams: { perPage?: string; pageNum?: string };
}) {
	const perPage = searchParams?.perPage ?? '12'; // Default to 12 if not specified
	const pageNum = searchParams?.pageNum ?? '1'; // Default to 1 if not specified
	const postsResponse = await getPosts(Number(pageNum), Number(perPage)); // Fetch posts

	return (
		<section className="flex h-full flex-col container gap-8 my-20">
			<h1 className="w-full text-start font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
				From the blog
			</h1>
			<Suspense fallback={<p>Loading...</p>}>
				<ClientInfiniteScroll
					increment={12}
					perPage={Number(perPage)}
					dataLength={postsResponse.posts?.length}
					hasMore={(postsResponse.posts?.length ?? 0) < postsResponse.total}
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{postsResponse?.posts.map((post, index) => {
							return <PostCard key={index} post={post} />;
						})}
					</div>
				</ClientInfiniteScroll>
			</Suspense>
		</section>
	);
}

export const PostCard = ({ post }: { post: Post }) => {
	return (
		<Card className="transition-transform duration-300 hover:scale-105">
			<Link href={`/blog/${post.slug?.current}`}>
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

				<div className="px-6 pt-4 pb-6 flex flex-col gap-2">
					<p className="text-base font-semibold">{post.title}</p>
					<p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>

					<div className="flex flex-1 gap-2 items-center">
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
};
