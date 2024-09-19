import { db } from '@/db/drizzle/db';
import { sendNotificationEmail } from './mail';
import { eq } from 'drizzle-orm';
import { user, userNotification } from '@/db/drizzle/schema';

export const createNotification = async ({
	userId,
	message,
	innerHTML,
	title,
}: {
	userId: string;
	message: string;
	innerHTML?: string;
	title?: string;
}) => {
	try {
		const userResponse = await db.query.user.findFirst({
			where: eq(user.id, userId),
		});

		if (!userResponse) return null;

		if (userResponse?.notificationsEnabled) {
			await sendNotificationEmail(userResponse.email, message, title ?? 'New notification');
		}

		const [newNotification] = await db
			.insert(userNotification)
			.values({
				userId: userId ?? '',
				title: title ?? 'New notification',
				message: message,
				readAt: null,
				updatedAt: new Date(),
			})
			.returning();

		return newNotification;
	} catch (error) {
		console.error(error);
		return null;
	}
};
