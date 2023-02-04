import { db } from '@/lib/db';
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db.schema.dropTableIfExists('users');
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstName');
    table.string('lastName');
    table.string('email');
    table.string('password');
  });

  res.status(200).json({ message: 'Database reset' });
}