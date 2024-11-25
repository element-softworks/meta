import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { getUserByEmail, getUserById } from './data/user';
import { db } from './db/drizzle/db';
import { LoginSchema } from './schemas';
import { eq } from 'drizzle-orm';
import { account, session, twoFactorConfirmation, user } from './db/drizzle/schema';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getCookie, setCookie } from './data/cookies';
import { getAccountByUserId } from './data/account';
import { user as dbUser } from './db/drizzle/schema/user';

export const {
	handlers,
	signIn,
	signOut,
	auth,
	unstable_update: update,
} = NextAuth({
	pages: {
		signIn: '/dashboard',
		signOut: '/',
		newUser: '/setup',
		error: '/auth/error',
	},
	adapter: DrizzleAdapter(db, {
		usersTable: user,
		accountsTable: account,
	}),
	session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
	secret: process.env.AUTH_SECRET,
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),

		Credentials({
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);
					if (!user || !user.password) return null;

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (passwordsMatch) {
						return user;
					}
				}
				return null;
			},
		}),
	],
	events: {
		//https://authjs.dev/reference/core search for "events"
		async signOut() {
			await setCookie({ name: 'session', value: '', maxAge: 0 });
		},

		async linkAccount({ user: userData }) {
			await db
				.update(user)
				.set({
					emailVerified: new Date(),
				})
				.where(eq(user.id, userData.id!));
		},
	},

	callbacks: {
		signIn: async ({ user, account }) => {
			const existingUser = await getUserById(user?.id ?? '');

			//Set the users last login date
			if (!!existingUser?.id) {
				await db
					.update(dbUser)
					.set({
						lastLogin: new Date(),
					})
					.where(eq(dbUser.id, existingUser?.id));
			}

			//Update the session with the user's email
			const sessionResponse = await getCookie('session');
			if (!!sessionResponse?.value?.length && !!existingUser?.email) {
				await db
					.update(session)
					.set({ email: existingUser?.email })
					.where(eq(session.id, sessionResponse?.value));
			}

			//Prevent login if user is archived
			if (existingUser?.isArchived) return false;

			//Allow OAuth without email verification
			if (account?.provider !== 'credentials') return true;

			//Prevent login if email is not verified
			if (!existingUser?.emailVerified) return false;

			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmationResponse = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);

				if (!twoFactorConfirmationResponse) return false;

				//Delete the two-factor confirmation for next sign in
				await db
					.delete(twoFactorConfirmation)
					.where(eq(twoFactorConfirmation.id, twoFactorConfirmationResponse.id!));
			}

			return true;
		},

		//https://authjs.dev/reference/core search for "callbacks"
		session: async ({ token, session }) => {
			//Signout users that are archived
			if (token?.isArchived) {
				await setCookie({ name: 'session', value: '', maxAge: 0 });
				await signOut();
			}

			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email || '';
				session.user.isOAuth = token.isOAuth;
				session.user.isArchived = token.isArchived;
				session.user.image = token.image;
				session.user.notificationsEnabled = token.notificationsEnabled;
				session.user.stripePaymentId = token.stripePaymentId;
				session.user.stripeCustomerId = token.stripeCustomerId;
			}

			return session;
		},

		jwt: async ({ token, session }) => {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = session?.name ?? existingUser.name;
			token.email = session?.email ?? existingUser.email;
			token.role = session?.role ?? existingUser.role;
			token.isArchived = session?.isArchived ?? existingUser.isArchived;
			token.isTwoFactorEnabled =
				session?.isTwoFactorEnabled ?? existingUser.isTwoFactorEnabled;
			token.image = session?.image ?? existingUser.image;
			token.notificationsEnabled =
				session?.notificationsEnabled ?? existingUser.notificationsEnabled;
			token.stripePaymentId = session?.stripePaymentId ?? existingUser.stripePaymentId;
			token.stripeCustomerId = session?.stripeCustomerId ?? existingUser.stripeCustomerId;
			return token;
		},
	},
});
