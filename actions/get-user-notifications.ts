'use server';

import { db } from '@/db/drizzle/db';
import { userNotification } from '@/db/drizzle/schema';
import { UserNotification } from '@prisma/client';
import { and, count, desc, eq, isNull } from 'drizzle-orm';

export const getUserNotifications = async (userId: string, perPage: number, pageNum: number) => {
	try {
		const [notificationsCount] = await db
			.select({ count: count() })
			.from(userNotification)
			.where(eq(userNotification.userId, userId));

		const notificationsResponse = await db
			.select()
			.from(userNotification)
			.where(eq(userNotification.userId, userId))
			.orderBy(desc(userNotification.createdAt))
			.limit(perPage)
			.offset(perPage * (pageNum - 1));

		const [unreadNotifications] = await db
			.select({ count: count() })
			.from(userNotification)
			.where(and(eq(userNotification.userId, userId), isNull(userNotification.readAt)));

		return {
			notifications: notificationsResponse,
			total: notificationsCount.count,
			unreadCount: unreadNotifications.count,
		} as GetUserNotificationsResponse;
	} catch (error) {
		console.error(error);
		return null;
	}
};

export type GetUserNotificationsResponse = {
	notifications: UserNotification[];
	total: number;
	unreadCount: number;
};
