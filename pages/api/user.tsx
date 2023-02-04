import { db, User } from '@/lib/db';
import { NextApiResponse, NextApiRequest } from 'next'
import { withSessionAPI } from '@/lib/session';

export default withSessionAPI(async function handler(req: NextApiRequest, res: NextApiResponse<User | null>) {
  if (!req.session.user) {
    res.status(200).json(null);
    return;
  }

  const storedUser = await db("users").where({ id: req.session.user.id }).first();

  if (!storedUser || storedUser.password !== req.session.user.password) {
    req.session.user = null;
  } else {
    req.session.user = storedUser as User;
  }

  await req.session.save();

  res.status(200).json(req.session.user);
});