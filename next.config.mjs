/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: '**.googleusercontent.com',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;
