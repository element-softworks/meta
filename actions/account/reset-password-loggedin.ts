'use server';
import { getUserById } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { ResetPasswordSchema, SettingsSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import z from 'zod';
export const resetPasswordLoggedin = async (values: z.infer<typeof ResetPasswordSchema>) => {
	const userResponse = await currentUser();

	if (!userResponse) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(userResponse?.id ?? '');

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

	if (userResponse.isOAuth) {
		return { error: 'Cannot update password as OAuth user' };
	}

	await db
		.update(user)
		.set({
			password: values.password,
		})
		.where(eq(user.id, userResponse.id!));

	return { success: 'Settings updated' };
};
