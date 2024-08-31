'use server';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ResetPasswordSchema, SettingsSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import z from 'zod';
export const resetPasswordLoggedin = async (values: z.infer<typeof ResetPasswordSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(user?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

		if (!passwordsMatch) {
			return { error: 'Invalid password' };
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, 10);

		values.password = hashedPassword;
	}

	if (user.isOAuth) {
		return { error: 'Cannot update password as OAuth user' };
	}

	await db.user.update({
		where: { id: user.id },
		data: {
			password: values.password,
		},
	});

	return { success: 'Settings updated' };
};
