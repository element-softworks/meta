'use server';
import { update } from '@/auth';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import z from 'zod';
export const updateUserSettings = async (
	values: z.infer<typeof SettingsSchema>,
	userId?: string
) => {
	const user = await currentUser();
	const isAdminMode = !!userId?.length;

	//If we pass a userId, we are an admin changing another user's settings

	//If we are editing another user and we arent an admin, throw an error
	if (isAdminMode && user?.role !== UserRole.ADMIN) {
		return { error: 'Unauthorized' };
	}

	if (!user) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(user?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	if (user.role !== UserRole.ADMIN) {
		values.role = dbUser.role;
	}

	//As an oauth user, we can't update email and password and have no two factor authentication on app
	const updatedUser = await db.user.update({
		where: { id: isAdminMode ? userId : user.id },
		data: {
			name: values.name,
			role: values.role,
			isTwoFactorEnabled: values.isTwoFactorEnabled,
			email: undefined,
			password: undefined,
			emailVerified: undefined,
		},
	});

	update({ user: updatedUser });
	revalidatePath(`/dashboard/admin/users/${updatedUser.id}`);

	return { success: 'Settings updated', user: updatedUser };
};
