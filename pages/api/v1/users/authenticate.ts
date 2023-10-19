import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/usersRepository'
import { getMongoDb } from '@/lib/config/mongo'

async function authenticate(req: NextApiRequest, res: NextApiResponse) {
	const db = await getMongoDb()
	const { username, password } = req.body
	const user = await usersRepository.authenticate(db, username, password)
	return res.status(200).json(user)
}

export default apiHandler({
	POST: authenticate,
})
