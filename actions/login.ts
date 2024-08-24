'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const login = async (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem logging in, check your credentials and try again.' };
	}

	const { email, password } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser || !existingUser.email || !existingUser.password) {
		return { error: 'Invalid credentials, check your email and password and try again.' };
	}

	if (!existingUser.emailVerified) {
		// Generate a verification token and send it to the user via email
		const verificationToken = await generateVerificationToken(email);
		try {
			await sendVerificationEmail(verificationToken);
		} catch (error: any) {
			console.error(error);
			return {
				error: error.message ?? 'There was a problem sending the verification email.',
			};
		}
		return { success: 'Confirmation email sent.' };
	}

	try {
		await signIn('credentials', {
			email,
			password,
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
		return { success: 'Logged in successfully.' };
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
};
