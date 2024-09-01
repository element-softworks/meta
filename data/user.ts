import { db } from '@/lib/db';

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({ where: { email } });
		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({ where: { id } });
		const isOAuth = await db.account.findFirst({
			where: {
				userId: user?.id,
			},
		});

		return { ...user!, isOAuth: !!isOAuth };
	} catch (error) {
		console.error(error);
		return null;
	}
};
