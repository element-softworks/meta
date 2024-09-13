'use server';

import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type GetUserNotifications = {
	notifications: Prisma.UserNotificationGetPayload<{
		include: {};
	}>[];
	total: number;
	unreadCount: number;
};

export const getUserNotifications = async (userId: string, perPage: number, pageNum: number) => {
	try {
		const notifications = await db.$transaction([
			db.userNotification.count({
				where: {
					userId,
				},
			}),

			db.userNotification.findMany({
				where: {
					userId,
				},
				orderBy: {
					createdAt: 'desc',
				},

				skip: perPage * (pageNum - 1),
				take: perPage,
			}),
			db.userNotification.count({
				where: {
					userId,
					AND: {
						readAt: null,
					},
				},
			}),
		]);

		return {
			notifications: notifications[1],
			total: notifications[0],
			unreadCount: notifications[2],
		};
	} catch (error) {
		console.error(error);
		return null;
	}
};
