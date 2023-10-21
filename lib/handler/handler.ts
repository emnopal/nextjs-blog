import type { NextApiRequest, NextApiResponse } from 'next'
import { errorHandler } from '@/lib/handler/error'
import { jwtMiddleware } from '@/lib/middleware/jwt'
import jwt from 'jsonwebtoken'

export interface ISession{
	id?: string
	role?: string
}

export function apiHandler(handler: any) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method
		if (method) {
			if (!handler[method]) {
				return res.status(405).end(`Method ${req.method} Not Allowed`)
			}
			try {
				const decodedToken = jwt.decode(req.headers.authorization?.split(' ').pop() as string) as jwt.JwtPayload
				const tokenId = decodedToken?.id
				const tokenRole = decodedToken?.role
				const session: ISession = {
					id: tokenId,
					role: tokenRole
				}
				await jwtMiddleware(req, res)
				await handler[method](req, res, session)
			} catch (err) {
				errorHandler(err as Error, res)
			}
		}
	}
}
