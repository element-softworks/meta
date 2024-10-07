import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../../env';
import { Post } from '@/sanity/sanity.types';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
	const slugs = await client.fetch(`*[_type == "post" && defined(slug.current)].slug.current`);
	return slugs;
}

export async function getPostBySlug(slug: string): Promise<Post> {
	const post = await client.fetch(
		`*[_type == "post" && slug.current == $slug]{
			...,
			author->{
				name,
				image,
				bio
			}
		}[0]`,
		{ slug }
	);
	return post;
}

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getPosts(
	page: number = 1,
	pageSize: number = 10,
	currentSlug?: string // optional parameter for the current slug
): Promise<{ posts: Post[]; totalPages: number; total: number }> {
	// Calculate the number of items to skip based on the current page
	const offset = (page - 1) * pageSize;

	// Fetch the total number of posts excluding the current post (if currentSlug is provided)
	const totalPosts = await client.fetch(
		`count(*[_type == "post" ${!!currentSlug?.length ? `&& slug.current != $currentSlug` : ''}])`,
		!!currentSlug ? { currentSlug } : {}
	);

	// Calculate the total number of pages
	const totalPages = Math.ceil(totalPosts / pageSize);

	// Fetch the posts, excluding the current post (if currentSlug is provided)
	const posts = await client.fetch(
		`*[_type == "post" ${!!currentSlug?.length ? `&& slug.current != $currentSlug` : ''}]{
			...,
			author->{
				name,
				image,
				bio
			}
		} | order(_createdAt desc) [${offset}...${offset + pageSize}]`,
		!!currentSlug ? { currentSlug } : {}
	);

	return { posts, totalPages, total: totalPosts };
}
