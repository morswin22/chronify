import type { User } from './user';

declare module "iron-session" {
  interface IronSessionData {
    user: User | null
  }
}

export const sessionConfig = {
  password: process.env.SESSION_PASSWORD ?? "",
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};