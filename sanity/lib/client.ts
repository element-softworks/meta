import { Post } from '@/sanity/sanity.types';
import { createClient } from 'next-sanity';
import { QueryParams } from 'sanity';
import { apiVersion, dataset, projectId } from '../../env';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<QueryResponse>({
	query,
	qParams = {},
	tags,
}: {
	query: string;
	qParams?: QueryParams;
	tags: string[];
}): Promise<QueryResponse> {
	return client.fetch<QueryResponse>(query, qParams, {
		cache: 'force-cache',
		next: { tags },
	});
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
	return await sanityFetch<{ slug: string }[]>({
		query: '*[_type == "post" && defined(slug.current)].slug.current',
		tags: ['post'],
	});
}

export async function getPostBySlug(slug: string): Promise<Post> {
	const post = await sanityFetch<Post>({
		query: `*[_type == "post" && slug.current == $slug]{
			...,
			author->{
				name,
				image,
				bio
			}
		}[0]`,
		qParams: { slug },
		tags: ['post'],
	});
	return post;
}

export async function getPosts(
	page: number = 1,
	pageSize: number = 10,
	currentSlug?: string
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
	const offset = (page - 1) * pageSize;

	const totalPosts = await sanityFetch<number>({
		query: `count(*[_type == "post" ${!!currentSlug?.length ? `&& slug.current != $currentSlug` : ''}])`,
		qParams: !!currentSlug ? { currentSlug } : {},
		tags: ['post'],
	});

	const totalPages = Math.ceil(totalPosts / pageSize);

	const posts = await sanityFetch<Post[]>({
		query: `*[_type == "post" ${!!currentSlug?.length ? `&& slug.current != $currentSlug` : ''}]{
			...,
			author->{
				name,
				image,
				bio
			}
		} | order(_createdAt desc) [${offset}...${offset + pageSize}]`,
		qParams: !!currentSlug ? { currentSlug } : {},
		tags: ['post'],
	});

	return { posts, totalPages, total: totalPosts };
}
