import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler';
import { usersRepository } from '@/repository/usersRepository';

async function authenticate(req: NextApiRequest, res: NextApiResponse) {
    const user = await usersRepository.authenticate(req.body);
    return res.status(200).json(user);
}

export default apiHandler({
    POST: authenticate
});