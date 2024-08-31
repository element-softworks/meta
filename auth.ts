import { login } from '@/actions/login';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { getUserById } from './data/user';
import { db } from './lib/db';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getAccountByUserId } from './data/account';

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
	unstable_update: update,
} = NextAuth(authConfig);
