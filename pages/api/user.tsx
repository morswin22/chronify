import type { User } from '@/lib/user';
import { isUserValid } from '@/lib/user';
import { NextApiResponse, NextApiRequest } from 'next'
import { withSessionAPI } from '@/lib/session';

export default withSessionAPI(async function handler(req: NextApiRequest, res: NextApiResponse<User | null>) {
  if (!req.session.user) {
    res.status(200).json(null);
    return;
  }

  req.session.user = await isUserValid(req.session.user);
  await req.session.save();

  res.status(200).json(req.session.user);
});