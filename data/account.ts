import { db } from '@/db/drizzle/db';
import { account } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getAccountByUserId = async (userId: string) => {
	try {
		const accountResponse = await db.query.account.findFirst({
			where: eq(account.userId, userId),
		});

		return accountResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};
