'use server';

import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const emailNotificationsEnabledToggle = async (enabled: boolean, userId: string) => {
	const user = await getUserById(userId);

	if (!user) {
		return { error: 'User not found' };
	}

	await db.user.update({
		where: {
			id: userId,
		},
		data: {
			notificationsEnabled: enabled,
		},
	});

	revalidatePath('/dashboard/notifications');

	return { success: 'Email notification preferences updated' };
};
