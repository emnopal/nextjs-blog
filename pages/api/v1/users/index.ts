import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '@/lib/handler/handler';
import { usersRepository } from '@/repository/usersRepository';

async function getAll(req: NextApiRequest, res: NextApiResponse) {
    const users = await usersRepository.getAll();
    return res.status(200).json(users);
}

export default apiHandler({
    GET: getAll
});