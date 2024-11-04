import { getConciergeTokenByEmail } from '@/data/concierge-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/db/drizzle/db';
import {
	conciergeToken,
	passwordResetToken,
	twoFactorToken,
	verificationToken,
} from '@/db/drizzle/schema';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
export const generateTwoFactorToken = async (email: string) => {
	crypto.randomInt(100_000, 1_000_000).toString();
	const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

	const existingToken = await getTwoFactorTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.delete(twoFactorToken).where(eq(twoFactorToken.id, existingToken.id));
	}

	const [twoFactorTokenResponse] = await db
		.insert(twoFactorToken)
		.values({
			token: crypto.randomInt(100_000, 1_000_000).toString(),
			email,
			expiresAt,
		})
		.returning();

	return twoFactorTokenResponse;
};

//Generate email verification token for credentials authentication method
export const generateVerificationToken = async (currentEmail: string, newEmail?: string) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

	//If new email is provided, send the email to the new email address to verify it
	const existingToken = await getVerificationTokenByEmail(!!newEmail ? newEmail : currentEmail);

	// If a token already exists, delete it
	if (existingToken) {
		await db.delete(verificationToken).where(eq(verificationToken.id, existingToken.id));
	}

	const [verificationTokenResponse] = await db
		.insert(verificationToken)
		.values({
			token,
			email: currentEmail,
			newEmail: newEmail ?? null,
			expiresAt,
		})
		.returning();

	return verificationTokenResponse;
};

//Generate email verification token for credentials authentication method
export const generateConciergeToken = async ({ email, name }: { email: string; name: string }) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week

	//If new email is provided, send the email to the new email address to verify it
	const existingToken = await getConciergeTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.delete(conciergeToken).where(eq(conciergeToken.id, existingToken.id));
		// await db.conciergeToken.delete({ where: { id: existingToken.id } });
	}

	const [conciergeTokenResponse] = await db
		.insert(conciergeToken)
		.values({
			token,
			email,
			expiresAt,
			name,
		})
		.returning();

	return conciergeTokenResponse;
};

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4();
	const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

	const existingToken = await getPasswordResetTokenByEmail(email);

	// If a token already exists, delete it
	if (existingToken) {
		await db.delete(passwordResetToken).where(eq(passwordResetToken.id, existingToken.id));
	}

	const [passwordResetTokenResponse] = await db
		.insert(passwordResetToken)
		.values({
			token,
			email,
			expiresAt,
		})
		.returning();

	return passwordResetTokenResponse;
};
