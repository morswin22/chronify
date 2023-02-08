import type { User } from '@/lib/user';
import { NextApiResponse, NextApiRequest } from 'next'
import { withValidUserAPI } from '@/lib/session';
import type { Category } from '@/app/dashboard/categories';
import { db } from '@/lib/db';

export default withValidUserAPI(async function handler(req: NextApiRequest, res: NextApiResponse<Category[] | Category | { message: string }>) {
  const user = req.session.user as User;
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    res.status(400).json({ message: 'Bad Request' });
    return;
  }

  if (Number.isInteger(parseInt(id))) {
    switch (req.method) {
      case 'GET':
        res.status(200).json(await db('categories').where({ userId: user.id, id }).first());
        break;
      case 'POST':
        await db('categories').update({ name: req.body.name }).where({ userId: user.id, id });
        res.status(200).json(await db('categories').where({ userId: user.id, id }).first());
        break;
      case 'DELETE':
        await db('categories').delete().where({ userId: user.id, id });
        res.status(200).json({ message: 'Category deleted' });
        break;
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
        break;
    }
  } else {
    switch (req.method) {
      case 'GET':
        res.status(200).json(await db('categories').where({ userId: user.id }).whereLike('name', `%${id}%`));
        break;
      default:
        res.status(405).json({ message: 'Method Not Allowed' });
        break;
    }
  }

  
});