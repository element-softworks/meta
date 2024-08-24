'use server';

import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { db } from '@/lib/db';

export const newVerification = async (token: string | null) => {
	if (!token) {
		return { error: 'Missing token' };
	}

	const existingToken = await getVerificationTokenByToken(token);

	console.log(existingToken, 'existingToken');
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

	await db.user.update({
		where: { id: existingUser.id },
		data: { emailVerified: new Date(), email: existingToken.email },
	});

	await db.verificationToken.delete({
		where: { id: existingToken.id },
	});

	console.log('Email verified successfully');

	return { success: 'Email verified successfully' };
};
