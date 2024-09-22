'use server';
import { update } from '@/auth';
import { getUserById } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { SettingsSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import z from 'zod';
export const updateUserSettings = async (
	values: z.infer<typeof SettingsSchema>,
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

	if (userResponse.role !== 'ADMIN') {
		values.role = dbUser.role;
	}

	//As an oauth user, we can't update email and password and have no two factor authentication on app
	const [updatedUser] = await db
		.update(user)
		.set({
			name: values.name,
			role: values.role,
			isTwoFactorEnabled: values.isTwoFactorEnabled,
			email: undefined,
			password: undefined,
			emailVerified: undefined,
		})
		.where(eq(user.id, isAdminMode ? userId! : userResponse.id!))
		.returning({
			id: user.id,
			name: user.name,
			role: user.role,
			isTwoFactorEnabled: user.isTwoFactorEnabled,
		});

	update({ user: updatedUser });
	revalidatePath(`/dashboard/admin/users/${updatedUser.id}`);

	return { success: 'Settings updated', user: updatedUser };
};
