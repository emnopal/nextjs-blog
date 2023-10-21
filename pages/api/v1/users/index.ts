import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, type ISession } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/users'
import { getMongoDb } from '@/lib/config/mongo'

async function getAll(req: NextApiRequest, res: NextApiResponse, session: ISession) {
	const db = await getMongoDb()
	const user = await usersRepository.getById(db, session.id as string)
	if (session.role === 'superadmin') {
		const users = await usersRepository.getAll(db)
		return res.status(200).json(users)
	}
	return res.status(200).json([user])
}

export default apiHandler({
	GET: getAll,
})
