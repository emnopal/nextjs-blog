import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, ISession } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/users'
import { getMongoDb } from '@/lib/config/mongo'

async function register(req: NextApiRequest, res: NextApiResponse, session: ISession) {
	const db = await getMongoDb()
	await usersRepository.create(db, req.body)
	return res.status(200).json({})
}

export default apiHandler({
	POST: register,
})
