import { ClientInfiniteScroll } from '@/components/ClientInfiniteScroll';
import { PostCard } from '@/components/post-card';
import { getPosts } from '@/sanity/lib/client';

//This component is SSR due to pagination needing dynamic params data

export async function generateMetadata() {
	return {
		title: `Blog | NextJS SaaS Boilerplate`,
		description: 'Read the latest articles from our blog.',
		openGraph: {
			title: `Blog | NextJS SaaS Boilerplate`,
			description: 'Read the latest articles from our blog.',
		},
		twitter: {
			title: `Blog | NextJS SaaS Boilerplate`,
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
		<section className="flex h-full flex-col container gap-8 my-10 lg:my-20">
			<h1 className="w-full text-start font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
				From the blog
			</h1>
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
		</section>
	);
}
