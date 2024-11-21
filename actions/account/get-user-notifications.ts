'use server';

import { db } from '@/db/drizzle/db';
import { userNotification } from '@/db/drizzle/schema';
import { UserNotification } from '@/db/drizzle/schema/userNotification';
import { currentUser } from '@/lib/auth';
import { and, count, desc, eq, isNull } from 'drizzle-orm';

export const getUserNotifications = async (
	userId: string,
	perPage: number,
	pageNum: number,
	unreadOnly?: boolean
) => {
	const authUser = await currentUser();

	if (!authUser) {
		return null;
	}

	try {
		const [notificationsCount] = await db
			.select({ count: count() })
			.from(userNotification)
			.where(
				and(
					eq(userNotification.userId, userId),
					unreadOnly ? isNull(userNotification.readAt) : undefined
				)
			);

		const notificationsResponse = await db
			.select()
			.from(userNotification)
			.where(
				and(
					eq(userNotification.userId, userId),
					unreadOnly ? isNull(userNotification.readAt) : undefined
				)
			)
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
	error?: string;
};
