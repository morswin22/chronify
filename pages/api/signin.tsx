import { db, User } from '@/lib/db';
import { NextApiResponse, NextApiRequest } from 'next'
import bcrypt from 'bcrypt';
import { withSessionAPI } from '@/lib/session';

export type SinginCredentials = {
  email: string;
  password: string;
};

export type SigninResponse = {
  id: number; 
} | {
  message: string;
};

export default withSessionAPI(async function handler(req: NextApiRequest, res: NextApiResponse<SigninResponse>) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body as SinginCredentials;

  const user = await db("users").where({ email }).first();

  if (!user) {
    res.status(409).json({ message: 'Wrong email or password' });
    return;
  }

  const { id, password: storedPassword } = user as User;

  if (!bcrypt.compareSync(password, storedPassword)) {
    res.status(409).json({ message: 'Wrong email or password' });
    return;
  }

  req.session.user = user as User;
  await req.session.save();

  res.status(200).json({ id });
});