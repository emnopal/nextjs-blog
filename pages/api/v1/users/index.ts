import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/users'
import { getMongoDb } from '@/lib/config/mongo'
import jwt from 'jsonwebtoken'

async function getAll(req: NextApiRequest, res: NextApiResponse) {
	const decodedToken = jwt.decode(req.headers.authorization?.split(' ').pop() as string) as jwt.JwtPayload
	const db = await getMongoDb()
	const user = await usersRepository.getById(db, decodedToken.id)
	if (decodedToken.role === 'superadmin') {
		const users = await usersRepository.getAll(db)
		return res.status(200).json(users)
	}
	return res.status(200).json([user])
}

export default apiHandler({
	GET: getAll,
})
