/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		// Fix for using route handlers in modules
		config.resolve.fallback = { fs: false };

		return config;
	},
	images: {
		domains: ['localhost', 'via.placeholder.com'],
	},
	output: "out",
	outDir: "dist",
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	basePath: '/PilzkriegerWeb',

}

module.exports = nextConfig