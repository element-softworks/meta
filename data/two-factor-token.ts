import { db } from '@/db/drizzle/db';
import { twoFactorToken } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const twoFactorTokenResponse = await db.query.twoFactorToken.findFirst({
			where: eq(twoFactorToken.token, token),
		});

		return twoFactorTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorTokenResponse = await db.query.twoFactorToken.findFirst({
			where: eq(twoFactorToken.email, email),
		});

		return twoFactorTokenResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
