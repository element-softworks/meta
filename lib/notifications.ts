import { sendNotificationEmail } from './mail';
import { db } from './db';

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
		const user = await db.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				id: true,
				email: true,
				name: true,
				notificationsEnabled: true,
			},
		});

		if (!user) return null;

		if (user?.notificationsEnabled) {
			await sendNotificationEmail(user.email, message, title ?? 'New notification');
		}

		const notification = await db.userNotification.create({
			data: {
				dangerouslySetInnerHTML: innerHTML ?? '',
				userId: userId ?? '',
				title: title ?? 'New notification',
				message: message,
				readAt: null,
			},
		});
		return notification;
	} catch (error) {
		console.error(error);
		return null;
	}
};
