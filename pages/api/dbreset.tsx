import { createDatabase } from '@/lib/db';
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await createDatabase();

  res.status(200).json({ message: 'Database reset' });
}