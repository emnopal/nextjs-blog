import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler';
import { usersRepository } from '@/repository/usersRepository';

async function register(req: NextApiRequest, res: NextApiResponse) {
    await usersRepository.create(req.body);
    return res.status(200).json({});
}

export default apiHandler({
    POST: register
});