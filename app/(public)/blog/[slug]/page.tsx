import { boilerplateConfig } from '@/boilerplate.config';
import { Markdown } from '@/components/markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { getAllPostSlugs, getPostBySlug } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);

	return {
		title: `${post.title} Blog | ${boilerplateConfig.projectName}`,
		description: `${post.excerpt}`,
		openGraph: {
			title: `${post.title} Blog | ${boilerplateConfig.projectName}`,
			description: `${post.excerpt}`,
		},
		twitter: {
			title: `${post.title} Blog | ${boilerplateConfig.projectName}`,
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

	// Return 404 if no case study found
	if (!post) {
		notFound();
	}

	return (
		<section className="container pb-16 lg:pb-32">
			<div className="grid grid-cols-12 gap-6 mt-12 ">
				<Card className="col-span-12 md:col-span-8 lg:p-4">
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
										className="rounded-none"
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
				<div className="col-span-12 md:col-span-4 block">
					<Card className=" sticky top-[76px] lg:top-24 right-0 ml-auto">
						<CardHeader></CardHeader>
						<CardContent>
							<CardDescription>Lets get you setup</CardDescription>
							<Link href="/auth/register">
								<Button className="w-full">Get Started</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
