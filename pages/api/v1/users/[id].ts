import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/usersRepository'
import { getMongoDb } from '@/lib/config/mongo'

async function getById(req: NextApiRequest, res: NextApiResponse) {
	const db = await getMongoDb()

	const { id } = req.query

	if (id) {
		const user = await usersRepository.getById(db, id as string)
		if (!user) throw 'User Not Found'
		return res.status(200).json(user)
	}
}

async function update(req: NextApiRequest, res: NextApiResponse) {
	const db = await getMongoDb()

	const { id } = req.query

	if (id) {
		await usersRepository.update(db, id as string, req.body)
		return res.status(200).json({})
	}
}

async function _delete(req: NextApiRequest, res: NextApiResponse) {
	const db = await getMongoDb()

	const { id } = req.query

	if (id) {
		await usersRepository.delete(db, id as string)
		return res.status(200).json({})
	}
}

export default apiHandler({
	GET: getById,
	PUT: update,
	DELETE: _delete,
})
