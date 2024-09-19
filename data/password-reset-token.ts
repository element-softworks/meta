import { eq } from 'drizzle-orm';
import { passwordResetToken } from './../db/drizzle/schema';
import { db } from '@/db/drizzle/db';

export const getPasswordResetTokenByToken = async (token: string) => {
	try {
		const passwordResetTokenResponse = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.token, token),
		});
		return passwordResetTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getPasswordResetTokenByEmail = async (email: string) => {
	try {
		const passwordResetTokenResponse = await db.query.passwordResetToken.findFirst({
			where: eq(passwordResetToken.email, email),
		});
		return passwordResetTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
