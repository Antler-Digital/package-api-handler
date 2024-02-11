import type { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';

// nextAuth authenticator
const NextAuth = async (request: NextApiRequest) => {
  return await getToken({
    req: request,
    secret: `${process.env.NEXTAUTH_SECRET}`,
  });
};
const authenticators = {
  NextAuth,
};

export default authenticators;
