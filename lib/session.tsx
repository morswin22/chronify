import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult, } from 'next';
import { User } from './db';

declare module "iron-session" {
  interface IronSessionData {
    user: User | null
  }
}

const sessionConfig = {
  password: process.env.SESSION_PASSWORD ?? "",
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSessionAPI(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionConfig);
}

// TODO this does not work with the experimental app/ directory
export function withSessionSSR<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionConfig);
}
