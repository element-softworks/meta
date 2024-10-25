'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { generateTwoFactorToken } from '@/lib/tokens';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { db } from '@/db/drizzle/db';
import { eq } from 'drizzle-orm';
import { teamMember, twoFactorConfirmation, twoFactorToken } from '@/db/drizzle/schema';

export const login = async (
	values: z.infer<typeof LoginSchema>,
	isTwoFactorStep: boolean,
	callbackUrl?: string | null
) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem logging in, check your credentials and try again.' };
	}

	const { email, password, code } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	const [isUserInTeam] = await db
		.select()
		.from(teamMember)
		.where(eq(teamMember.userId, existingUser?.id ?? ''));

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: 'Invalid credentials, check your email and password and try again.' };
	}

	if (existingUser.isArchived) {
		return {
			error: 'This account has been archived. Please contact our support team if you think this is a mistake',
		};
	}

	if (!existingUser.emailVerified) {
		// Generate a verification token and send it to the user via email
		const verificationToken = await generateVerificationToken(email);
		const data = await sendVerificationEmail(verificationToken);
		if (data.error) {
			return { error: data.error };
		}

		return { success: 'Confirmation email sent.' };
	}

	const isLocalhost = process.env.NODE_ENV === 'development';

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code || isTwoFactorStep) {
			//Verify code
			const twoFactorTokenResponse = await getTwoFactorTokenByEmail(existingUser.email);
			if (!twoFactorTokenResponse) {
				return { error: 'Invalid two-factor code, please try again.' };
			}

			if (twoFactorTokenResponse.token !== code) {
				return { error: 'Invalid two-factor code, please try again.' };
			}

			const hasExpired = new Date(twoFactorTokenResponse.expiresAt) < new Date();

			if (hasExpired) {
				return { error: 'Two-factor code has expired, please try again.' };
			}

			await db.delete(twoFactorToken).where(eq(twoFactorToken.id, twoFactorTokenResponse.id));

			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

			if (existingConfirmation) {
				await db
					.delete(twoFactorConfirmation)
					.where(eq(twoFactorConfirmation.id, existingConfirmation.id));
			}

			await db.insert(twoFactorConfirmation).values({
				userId: existingUser.id,
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			const data = await sendTwoFactorTokenEmail(twoFactorToken);

			if (data.error) {
				return { error: data.error };
			}

			return { twoFactor: true };
		}
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: !isUserInTeam ? '/setup' : (callbackUrl ?? DEFAULT_LOGIN_REDIRECT),
		});
		// return { success: 'Logged in successfully.' };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return {
						error: 'Invalid credentials, check your email and password and try again.',
					};
				default:
					return {
						error: 'There was a problem logging in, check your credentials and try again.',
					};
			}
		}

		throw error;
	}

	// return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT));
};
