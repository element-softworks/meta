'use server';
import { userNotification } from '../../db/drizzle/schema';
import { db } from '@/db/drizzle/db';
import { currentUser } from '@/lib/auth';
import { eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const markUserNotificationsRead = async ({
	notificationIds,
	all,
}: {
	notificationIds?: string[];
	all?: boolean;
}) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}
	try {
		await db
			.update(userNotification)
			.set({
				readAt: new Date(),
			})
			.where(
				all
					? eq(userNotification.userId, authUser.id!)
					: inArray(userNotification.id, notificationIds?.map((id) => id) ?? [])
			);

		revalidatePath('/');
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred while marking notifications as read' };
	}

	return { success: 'Notifications marked as read' };
};
