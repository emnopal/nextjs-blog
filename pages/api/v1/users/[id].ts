import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler, type ISession } from '@/lib/handler/handler'
import { usersRepository } from '@/repository/users'
import { getMongoDb } from '@/lib/config/mongo'

async function getById(req: NextApiRequest, res: NextApiResponse, session: ISession) {
	const db = await getMongoDb()

	const { id } = req.query

	if (id) {
		try {
			if (session.id == id || session.role === 'superadmin') {
				const user = await usersRepository.getById(db, id as string)
				if (!user) throw 'User Not Found'
				return res.status(200).json(user)
			}
			throw 'User Not Found'
		} catch (error) {
			throw error
		}
	}
}

async function update(req: NextApiRequest, res: NextApiResponse, session: ISession) {
	const db = await getMongoDb()

	const { _id, ...body } = req.body

	if (_id) {
		await usersRepository.update(db, _id as string, body)
		return res.status(200).json({})
	}
}

async function _delete(req: NextApiRequest, res: NextApiResponse, session: ISession) {
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
