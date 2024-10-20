'use server';
import { userNotification } from '../../db/drizzle/schema';
import { db } from '@/db/drizzle/db';
import { inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const markUserNotificationsRead = async ({
	notificationIds,
	all,
}: {
	notificationIds?: string[];
	all?: boolean;
}) => {
	try {
		await db
			.update(userNotification)
			.set({
				readAt: new Date(),
			})
			.where(
				all
					? undefined
					: inArray(userNotification.id, notificationIds?.map((id) => id) ?? [])
			);

		revalidatePath('/dashboard/notifications');
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred while marking notifications as read' };
	}

	return { success: 'Notifications marked as read' };
};
