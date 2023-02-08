import type { User } from '@/lib/user';
import { NextApiResponse, NextApiRequest } from 'next'
import { withValidUserAPI } from '@/lib/session';
import type { Category } from '@/app/dashboard/categories';
import { db } from '@/lib/db';

export default withValidUserAPI(async function handler(req: NextApiRequest, res: NextApiResponse<Category[] | Category | { message: string }>) {
  const user = req.session.user as User;
  
  switch (req.method) {
    case 'GET':
      res.status(200).json(await db('categories').where({ userId: user.id })); // TODO should limit to only 10 most frequently used / most recent
      break;
    case 'POST':
      const storedCategory = await db('categories').where({ userId: user.id, name: req.body.name }).first();
      if (storedCategory) {
        res.status(409).json({ message: 'Category already exists' });
        return;
      }
      const categoryId = await db('categories').insert({ userId: user.id, name: req.body.name });
      res.status(200).json(await db('categories').where({ id: categoryId }).first());
      break;
    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
  
});