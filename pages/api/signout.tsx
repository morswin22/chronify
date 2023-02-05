import { NextApiResponse, NextApiRequest } from 'next'
import { withSessionAPI } from '@/lib/session';

export default withSessionAPI(async function handler(req: NextApiRequest, res: NextApiResponse) {
  req.session.user = null;
  await req.session.save();
  res.status(200).json({ message: 'Signed out' });
});