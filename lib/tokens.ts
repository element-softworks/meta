import { getConciergeTokenByEmail } from '@/data/concierge-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { TeamRole } from '@prisma/client';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export const generateTwoFactorToken = async (email: string) => {
	crypto.randomInt(100_000, 1_000_000).toString();
	const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

	const existingToken = await getTwoFactorTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.twoFactorToken.delete({ where: { id: existingToken.id } });
	}

	const twoFactorToken = await db.twoFactorToken.create({
		data: {
			token: crypto.randomInt(100_000, 1_000_000).toString(),
			email,
			expiresAt,
		},
	});

	return twoFactorToken;
};

//Generate email verification token for credentials authentication method
export const generateVerificationToken = async (currentEmail: string, newEmail?: string) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

	//If new email is provided, send the email to the new email address to verify it
	const existingToken = await getVerificationTokenByEmail(!!newEmail ? newEmail : currentEmail);

	// If a token already exists, delete it
	if (existingToken) {
		await db.verificationToken.delete({ where: { id: existingToken.id } });
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			token,
			email: currentEmail,
			newEmail: newEmail ?? null,
			expiresAt,
		},
	});

	return verificationToken;
};

//Generate email verification token for credentials authentication method
export const generateConciergeToken = async ({
	email,
	name,
	teamId,
	role,
}: {
	email: string;
	name: string;
	teamId: string;
	role: TeamRole;
}) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week

	//If new email is provided, send the email to the new email address to verify it
	const existingToken = await getConciergeTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.conciergeToken.delete({ where: { id: existingToken.id } });
	}

	const conciergeToken = await db.conciergeToken.create({
		data: {
			token,
			email: email,
			expiresAt,
			teamId,
			name,
			role,
		},
	});

	return conciergeToken;
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
