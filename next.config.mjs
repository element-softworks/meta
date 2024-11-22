import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/auth/login',
				permanent: true,
			},
			{
				source: '/auth/register',
				destination: '/auth/coach-setup',
				permanent: true,
			},
		];
	},
};

const withBundleAnalyzerData = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzerData(nextConfig);
