'use server';

import { db } from '@/db/drizzle/db';
import { userNotification } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, count, eq, isNull } from 'drizzle-orm';

export const getUserNotificationsCount = async (userId: string) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}

	try {
		const [notificationsCount] = await db
			.select({ count: count() })
			.from(userNotification)
			.where(and(eq(userNotification.userId, userId), isNull(userNotification.readAt)));

		return { count: notificationsCount.count };
	} catch (error) {
		console.error(error);
		return null;
	}
};
