'use server';
import { update } from '@/auth';
import { getUserById } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { SettingsSchema, TwoFactorSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
export const updateUserTwoFactorPreferences = async (
	values: z.infer<typeof TwoFactorSchema>,
	userId?: string
) => {
	const userResponse = await currentUser();

	//If we are editing another user, we are in admin mode
	const isAdminMode = userId !== userResponse?.id;

	//If we are editing another user and we arent an admin, throw an error
	if (isAdminMode && userResponse?.role !== 'ADMIN') {
		return { error: 'Unauthorized' };
	}

	if (!userResponse) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(userResponse?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	//As an oauth user, we can't update email and password and have no two factor authentication on app
	const [updatedUser] = await db
		.update(user)
		.set({
			isTwoFactorEnabled: values.isTwoFactorEnabled,
		})
		.where(eq(user.id, isAdminMode ? userId! : userResponse.id!))
		.returning({
			id: user.id,
			isTwoFactorEnabled: user.isTwoFactorEnabled,
		});

	update({ user: updatedUser });
	revalidatePath(`/dashboard/admin/users/${updatedUser.id}`);

	return { success: 'Two factor preferences updated', user: updatedUser };
};
