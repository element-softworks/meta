import { db } from '@/db/drizzle/db';
import { twoFactorConfirmation } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const twoFactorConfirmationResponse = await db.query.twoFactorConfirmation.findFirst({
			where: eq(twoFactorConfirmation.userId, userId),
		});

		return twoFactorConfirmationResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
