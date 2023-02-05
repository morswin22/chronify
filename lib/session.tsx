import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult, } from 'next';
import { sessionConfig } from './sessionConfig';

export function withSessionAPI(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionConfig);
}

// this does not work with the experimental app/ directory
export function withSessionSSR<
  P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return withIronSessionSsr(handler, sessionConfig);
}