import type { NextApiRequest, NextApiResponse } from 'next'
import { expressjwt } from 'express-jwt'
import util from 'util'
import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()

export function jwtMiddleware(req: NextApiRequest, res: NextApiResponse) {

    const middleware = expressjwt({
		secret: serverRuntimeConfig.secret,
		algorithms: ['HS256'],
	}).unless({
		path: ['/api/v1/users/register', '/api/v1/users/authenticate'],
	})

	return middleware(req, res, () => {}) // todo: handle rejected promise, currently leave it empty
}
