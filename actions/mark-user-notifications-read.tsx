'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const markUserNotificationsRead = async ({
	notificationIds,
}: {
	notificationIds: string[];
}) => {
	try {
		await db.userNotification.updateMany({
			where: {
				id: {
					in: notificationIds,
				},
			},
			data: {
				readAt: new Date(),
			},
		});

		revalidatePath('/dashboard/notifications');
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred while marking notifications as read' };
	}

	return { success: 'Notifications marked as read' };
};
