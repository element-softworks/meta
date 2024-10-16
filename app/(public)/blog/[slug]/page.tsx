import { boilerplateConfig } from '@/boilerplate.config';
import { Markdown } from '@/components/markdown';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPostSlugs, getPostBySlug, getPosts } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);

	return {
		title: `${post.title} Blog | NextJS SaaS Boilerplate`,
		description: `${post.excerpt}`,
		openGraph: {
			title: `${post.title} Blog | NextJS SaaS Boilerplate`,
			description: `${post.excerpt}`,
		},
		twitter: {
			title: `${post.title} Blog | NextJS SaaS Boilerplate`,
			description: `${post.excerpt}`,
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${params.slug}`,
		},
	};
}

export async function generateStaticParams() {
	const allPosts = await getAllPostSlugs();

	return allPosts?.map((blog) => ({
		slug: blog.slug,
	}));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);
	const morePosts = await getPosts(1, 6, params.slug);

	// Return 404 if no case study found
	if (!post) {
		notFound();
	}

	return (
		<section className="container max-w-6xl pb-16 lg:pb-32">
			<div className="grid grid-cols-12 gap-4 mt-12 ">
				<Card className="col-span-12 lg:col-span-9 lg:p-4">
					<CardHeader>
						<h1 className="w-full text-start mb-4 font-semibold text-2xl md:text-3xl lg:text-4xl max-w-[22ch]">
							{post.title}
						</h1>
						<CardDescription>{post.excerpt}</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="-mx-4 lg:-mx-8 mt-4">
							<div className="relative h-auto w-full">
								{!!post?.mainImage && (
									<Image
										className="rounded-none aspect-video"
										alt={post.mainImage?.alt ?? 'Blog image'}
										src={urlFor(post.mainImage).width(600).url()}
										layout="responsive"
										width={600}
										height={0}
										objectFit="cover"
									/>
								)}
							</div>
						</div>
						<Markdown body={post.body!} />
					</CardContent>
				</Card>
				<div className="col-span-12 lg:col-span-3 block">
					<div className="flex flex-col sm:flex-row lg:flex-col gap-4 sticky top-[76px] lg:top-24 right-0 ">
						<Card className="border-primary drop-shadow-xl w-full sm:w-1/2 lg:w-full">
							<CardHeader>
								<div className="-m-4">
									<Image
										className="rounded-tr-md rounded-tl-md aspect-video object-cover"
										alt="Call to action"
										src="https://img.recraft.ai/kb6NwyzRIScHK8TJaj5WnKtRarKUQmEtsrTesJxRnXw/rs:fit:1536:1024:0/q:95/g:no/plain/abs://prod/images/8cddd895-2fb9-413d-9736-7c0615202de4@png"
										width={0}
										height={0}
										layout="responsive"
										objectFit="cover"
									/>
								</div>
							</CardHeader>
							<CardContent className="flex flex-col gap-4 mt-4">
								<CardDescription>
									Sign up to fast track your newest SaaS idea into reality with a
									robust, extensive, mature codebase created to the highest
									standard.
								</CardDescription>
								<Link href="/auth/register">
									<Button variant="secondary" className="w-full">
										Get it now
									</Button>
								</Link>
							</CardContent>
						</Card>
						<Card className="w-full sm:w-1/2 lg:w-full h-fit">
							<CardHeader className="pb-1">
								<CardTitle className="text-lg">Written by</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<div className="flex flex-1 gap-2 items-center">
									{!!post?.author?.image && (
										<Image
											className="rounded-full"
											alt={post.mainImage?.alt ?? 'Author image'}
											src={urlFor(post.author.image).width(100).url()}
											width={35}
											height={35}
										/>
									)}
									<div>
										<p className="text-sm font-semibold">
											{post?.author?.name ?? ''}
										</p>
										<p className="text-sm text-muted-foreground">
											{format(new Date(post._createdAt), 'dd/MM/yyyy')}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<div className="mt-12">
				<h1 className="w-full text-start font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
					More posts
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
					{morePosts?.posts?.map((post, index) => {
						return <PostCard key={index} post={post} />;
					})}
				</div>
			</div>
		</section>
	);
}
