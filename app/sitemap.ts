export default async function generateSitemaps() {
	return [
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/docs`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.8,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.7,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/register`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.9,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.2,
		},
		{
			url: `${process.env.NEXT_PUBLIC_APP_URL}/terms-of-service`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.2,
		},
	];
}
