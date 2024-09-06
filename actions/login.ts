'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn, update } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mail';
import { generateTwoFactorToken } from '@/lib/tokens';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

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

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: 'Invalid credentials, check your email and password and try again.' };
	}

	if (!!existingUser.isArchived?.length) {
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

	if (existingUser.isTwoFactorEnabled && existingUser.email) {
		if (code || isTwoFactorStep) {
			//Verify code
			const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
			if (!twoFactorToken) {
				return { error: 'Invalid two-factor code, please try again.' };
			}

			if (twoFactorToken.token !== code) {
				return { error: 'Invalid two-factor code, please try again.' };
			}

			const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();

			if (hasExpired) {
				return { error: 'Two-factor code has expired, please try again.' };
			}

			await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

			const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

			if (existingConfirmation) {
				await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
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
			redirectTo: callbackUrl ?? DEFAULT_LOGIN_REDIRECT,
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
