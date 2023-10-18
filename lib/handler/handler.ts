import type { NextApiRequest, NextApiResponse } from 'next'
import { errorHandler } from '@/lib/handler/error'
import { jwtMiddleware } from '@/lib/middleware/jwtMiddleware'

export function apiHandler(handler: any) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const method = req.method
		if (method) {
			if (!handler[method]) {
				return res.status(405).end(`Method ${req.method} Not Allowed`)
			}
			try {
				await jwtMiddleware(req, res)
				await handler[method](req, res)
			} catch (err) {
				errorHandler(err as Error, res)
			}
		}
	}
}
