import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Post } from '@/sanity/sanity.types';
import { getPosts } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function Blog() {
	const posts = await getPosts();

	console.log(posts, 'posts data');

	return (
		<section className="flex h-full flex-col container gap-8 mt-20">
			<h1 className="w-full text-start  font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
				From the blog
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{posts?.map((post, index) => {
					return <PostCard key={index} post={post} />;
				})}
			</div>
		</section>
	);
}

const PostCard = ({ post }: { post: Post }) => {
	return (
		<Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
			<Link href={`/blog/${post.slug?.current}`}>
				<div className="relative h-44 w-full">
					{!!post?.mainImage && (
						<Image
							alt={post.mainImage?.alt ?? 'Blog image'}
							src={urlFor(post.mainImage).width(600).url()}
							layout="fill"
							objectFit="cover"
						/>
					)}
				</div>

				<div className="px-6 py-4 flex flex-col gap-2">
					<p className="text-base font-semibold">{post.title}</p>
					<p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>

					<div className="flex flex-1 gap-2 items-center">
						{!!post?.author?.image && (
							<div className="relative size-6 rounded-full">
								<Image
									className="rounded-full"
									alt={post.mainImage?.alt ?? 'Blog image'}
									src={urlFor(post.author.image).width(600).url()}
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
