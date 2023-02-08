import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler, GetServerSidePropsContext, GetServerSidePropsResult, } from 'next';
import { sessionConfig } from './sessionConfig';
import { isUserValid } from './user';

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

export function withValidUserAPI(handler: NextApiHandler) {
  return withSessionAPI(async (req, res) => {
    if (!req.session.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
  
    req.session.user = await isUserValid(req.session.user);
    await req.session.save();
  
    if (!req.session.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    return handler(req, res);
  });
}