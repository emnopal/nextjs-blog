import { MongoClient } from 'mongodb'

declare global {
	namespace globalThis {
		var mongoClientPromise: Promise<MongoClient>
	}
}

export async function getMongoClient() {
	/**
	 * Global is used here to maintain a cached connection across hot reloads
	 * in development. This prevents connections growing exponentiatlly
	 * during API Route usage.
	 * https://github.com/vercel/next.js/pull/17666
	 */
	if (!global.mongoClientPromise) {
		const client = new MongoClient(process.env.MONGODB_URI as string)
		// client.connect() returns an instance of MongoClient when resolved
		global.mongoClientPromise = client.connect()
	}
	return global.mongoClientPromise
}

export async function getMongoDb() {
	const mongoClient = await getMongoClient()
	return mongoClient.db()
}
