'use server';

import { getUserById } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { eq, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const emailNotificationsEnabledToggle = async (enabled: boolean, userId: string) => {
	const userResponse = await getUserById(userId);

	if (!userResponse) {
		return { error: 'User not found' };
	}

	await db
		.update(user)
		.set({
			notificationsEnabled: enabled,
		})
		.where(eq(user.id, userId));

	revalidatePath('/dashboard/notifications');

	return { success: 'Email notification preferences updated' };
};
