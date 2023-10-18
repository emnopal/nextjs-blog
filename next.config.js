/** @type {import('next').NextConfig} */

if (!process.env.SECRET) {
	throw 'Please provide secret first'
}

const nextConfig = {
	reactStrictMode: true,
	serverRuntimeConfig: {
		connectionString:
			process.env.MONGODB_URI ?? 'mongodb://localhost/nextjs-example01',
		secret: process.env.SECRET,
		environmentMode: process.env.NODE_ENV,
	},
	publicRuntimeConfig: {
		apiUrl: {
			v1:
				process.env.NODE_ENV === 'development'
					? 'http://localhost:3000/api/v1' // development api
					: 'http://localhost:3000/api/v1', // production api
		},
	},
}

module.exports = nextConfig
