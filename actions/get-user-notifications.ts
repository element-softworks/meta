'use server';

import { db } from '@/lib/db';

export const getUserNotifications = async (userId: string) => {
	try {
		const notifications = await db.userNotification.findMany({
			where: {
				userId: userId,
			},
		});
		return notifications;
	} catch (error) {
		console.error(error);
		return null;
	}
};
