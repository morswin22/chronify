import { NextRequest, NextResponse } from 'next/server';
import { isUserValid } from '@/lib/user';
import { getIronSession } from 'iron-session/edge';
import { sessionConfig } from '@/lib/sessionConfig';

export const config = {
  matcher: '/dashboard/:path*',
  // runtime: 'nodejs'
};

// export const runtime = 'nodejs';

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next();

  const session = await getIronSession(request, response, sessionConfig);

  // TODO currently knex is not working in edge and there is no working option to change the runtime to nodejs
  // if (session.user) {
  //   session.user = await isUserValid(session.user);
  //   session.save();
  // }

  if (!session.user) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }
  
  return response;
}