import type { NextApiRequest, NextApiResponse } from 'next'
import util from 'util'
import { expressjwt } from 'express-jwt'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export function jwtMiddleware(req: NextApiRequest, res: NextApiResponse) {
	const middleware = expressjwt({
		secret: serverRuntimeConfig.secret,
		algorithms: ['HS256'],
	}).unless({
		path: ['/api/v1/users/register', '/api/v1/users/authenticate'],
	})

	return util.promisify(middleware)(req, res)
}
