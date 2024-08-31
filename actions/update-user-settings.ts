'use server';
import { update } from '@/auth';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
import z from 'zod';
export const updateUserSettings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

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
		where: { id: user.id },
		data: {
			name: values.name,
			role: values.role,
			isTwoFactorEnabled: values.isTwoFactorEnabled,

			email: undefined,
			password: undefined,
		},
	});

	update({ user: updatedUser });

	return { success: 'Settings updated', user: updatedUser };
};
