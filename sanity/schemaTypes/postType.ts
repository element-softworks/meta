import { DocumentTextIcon } from '@sanity/icons';
import {
	SanityAsset,
	SanityImageObject,
	SanityImageSource,
} from '@sanity/image-url/lib/types/types';
import { SanityImageAssetDocument } from 'next-sanity';
import { defineArrayMember, defineField, defineType } from 'sanity';

export interface PostProps {
	title: string;
	slug: string;
	author: any;
	mainImage: SanityImageAssetDocument;
	categories: any[];
	publishedAt: string;
	body: any;
}

export const postType = defineType({
	name: 'post',
	title: 'Post',
	type: 'document',
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: 'title',
			type: 'string',
		}),
		defineField({
			name: 'excerpt',
			type: 'string',
		}),
		defineField({
			name: 'slug',
			type: 'slug',
			options: {
				source: 'title',
			},
		}),
		defineField({
			name: 'author',
			type: 'reference',
			to: { type: 'author' },
		}),
		defineField({
			name: 'mainImage',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alternative text',
				},
			],
		}),
		defineField({
			name: 'categories',
			type: 'array',
			of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
		}),
		defineField({
			name: 'publishedAt',
			type: 'datetime',
		}),
		defineField({
			name: 'body',
			type: 'blockContent',
		}),
	],
	preview: {
		select: {
			title: 'title',
			author: 'author.name',
			media: 'mainImage',
		},
		prepare(selection) {
			const { author } = selection;
			return { ...selection, subtitle: author && `by ${author}` };
		},
	},
});
