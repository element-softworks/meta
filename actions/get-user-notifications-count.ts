'use server';

import { db } from '@/lib/db';

export const getUserNotificationsCount = async (userId: string) => {
	try {
		const notifications = await db.userNotification.count({
			where: {
				userId,
				read: false,
			},
		});
		return { count: notifications };
	} catch (error) {
		console.error(error);
		return null;
	}
};
