import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import { getUserById } from './data/user';

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		session: async ({ token, session }) => {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			return session;
		},
		jwt: async ({ token }) => {
			if (!token.sub) return token;

			const user = await getUserById(token.sub);

			if (!user) return token;

			token.role = user.role;
			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
});
