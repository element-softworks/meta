'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { db } from '@/db/drizzle/db';
import { user, verificationToken } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const newEmailVerification = async (token: string | null) => {
	if (!token) {
		return { error: 'Missing token' };
	}

	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: 'Invalid token' };
	}

	const hasTokenExpired = new Date(existingToken.expiresAt) < new Date();

	if (hasTokenExpired) {
		return { error: 'Token has expired' };
	}

	const existingUser = await getUserByEmail(existingToken.email);

	if (!existingUser) {
		return { error: 'User not found' };
	}

	//If a new email is provided, update the email to the new email
	await db
		.update(user)
		.set({
			email: !!existingToken.newEmail ? existingToken.newEmail : existingToken.email,
			emailVerified: new Date(),
		})
		.where(eq(user.id, existingUser.id));

	await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id));

	return { success: 'Email verified successfully' };
};
