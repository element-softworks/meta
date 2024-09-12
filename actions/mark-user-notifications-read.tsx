'use server';

import { db } from '@/lib/db';

export const markUserNotificationsRead = async ({
	notificationIds,
}: {
	notificationIds: string[];
}) => {
	const updatedNotifications = await Promise.all(
		notificationIds.map((notification) =>
			db.userNotification.update({
				where: {
					id: notification,
				},
				data: {
					readAt: new Date(),
				},
				select: {
					id: true,
					title: true,
				},
			})
		)
	);

	return updatedNotifications;
};
