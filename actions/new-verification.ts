'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { db } from '@/lib/db';

export const newVerification = async (token: string | null) => {
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
	await db.user.update({
		where: { id: existingUser.id },
		data: {
			emailVerified: new Date(),
			email: !!existingToken.newEmail ? existingToken.newEmail : existingToken.email,
		},
	});

	await db.verificationToken.delete({
		where: { id: existingToken.id },
	});

	return { success: 'Email verified successfully' };
};
