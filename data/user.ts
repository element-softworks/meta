import { db } from '@/db/drizzle/db';
import { account, user } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';

export const getUserByEmail = async (email: string) => {
	try {
		const userResponse = await db.query.user.findFirst({
			where: eq(user.email, email),
		});
		return userResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const userResponse = await db.query.user.findFirst({
			where: eq(user.id, id),
		});
		const isOAuth = await db.query.account.findFirst({
			where: eq(account.userId, id),
		});

		return { ...userResponse!, isOAuth: !!isOAuth };
	} catch (error) {
		console.error(error);
		return null;
	}
};
