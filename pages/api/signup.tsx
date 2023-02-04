import { db, PASSWORD_SALT_ROUNDS } from '@/lib/db';
import { NextApiResponse, NextApiRequest } from 'next'
import bcrypt from 'bcrypt';

export type SingupCredentials = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SignupResponse = ({
  id: number;
} & SingupCredentials) | {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignupResponse>) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { firstName, lastName, email, password } = req.body as SingupCredentials;

  const existingUser = await db("users").where({ email }).first();
  if (existingUser) {
    res.status(409).json({ message: 'User already exists' });
    return;
  }

  const [id] = await db("users").insert({
    firstName,
    lastName,
    email,
    password: bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS),
  });

  res.status(200).json({ id, firstName, lastName, email, password });
}