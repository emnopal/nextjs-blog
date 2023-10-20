import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/users'
import { getMongoDb } from '@/lib/config/mongo'

async function getAll(req: NextApiRequest, res: NextApiResponse) {
	const db = await getMongoDb()
	const users = await usersRepository.getAll(db)
	return res.status(200).json(users)
}

export default apiHandler({
	GET: getAll,
})
