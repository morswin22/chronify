import { cookies, headers } from 'next/headers';
import type { User } from '@/lib/user';

export async function getUser() {
  // TODO review this code
  const session = cookies().get("session");
  if (!session)
    return null;
  const host = headers().get("host");
  if (!host)
    return null;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const res = await fetch(`${protocol}://${host}/api/user`, {
    cache: 'no-cache',
    headers: {
      Cookie: `${session.name}=${session.value}`,
    },
  });
  const user = await res.json() as User | null;
  return user;
}