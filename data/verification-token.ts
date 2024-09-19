import { db } from '@/db/drizzle/db';
import { verificationToken } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getVerificationTokenByToken = async (token: string) => {
	try {
		const verificationTokenResponse = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.token, token),
		});
		return verificationTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationTokenResponse = await db.query.verificationToken.findFirst({
			where: eq(verificationToken.email, email),
		});
		return verificationTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
