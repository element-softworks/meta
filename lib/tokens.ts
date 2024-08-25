import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';

//Generate email verification token for credentials authentication method
export const generateVerificationToken = async (email: string) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

	const existingToken = await getVerificationTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.verificationToken.delete({ where: { id: existingToken.id } });
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			token,
			email,
			expiresAt,
		},
	});

	return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

	const existingToken = await getPasswordResetTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.passwordResetToken.delete({ where: { id: existingToken.id } });
	}

	const passwordResetToken = await db.passwordResetToken.create({
		data: {
			token,
			email,
			expiresAt,
		},
	});

	return passwordResetToken;
};
