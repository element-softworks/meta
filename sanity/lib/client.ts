import { createClient } from 'next-sanity';
import { PostProps, postType } from '../schemaTypes/postType';
import { apiVersion, dataset, projectId } from '../env';
import { Post } from '@/sanity/sanity.types';

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

// uses GROQ to query content: https://www.sanity.io/docs/groq
export async function getPosts(): Promise<Post[]> {
	const posts = await client.fetch(
		`*[_type == "post"]{
			...,
			author->{
				name,
				image,
				bio
			}
		}`
	);
	return posts;
}
