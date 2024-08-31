'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const newPasswordFinish = async (
	values: z.infer<typeof NewPasswordSchema>,
	token?: string | null
) => {
	if (!token) {
		return { error: 'Token not found' };
	}

	const validatedFields = NewPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem resetting your password, please try again later' };
	}

	const { password } = validatedFields.data;

	const existingToken = await getPasswordResetTokenByToken(token);
	if (!existingToken) {
		return { error: 'Token not found' };
	}

	const hasExpired = new Date(existingToken.expiresAt) < new Date();
	if (hasExpired) {
		return { error: 'Token has expired' };
	}

	const existingUser = await getUserByEmail(existingToken.email);
	if (!existingUser) {
		return { error: 'User not found' };
	}

	// Update the user's password
	const hashedPassword = await bcrypt.hash(password, 10);

	await db.user.update({
		where: { id: existingUser.id },
		data: {
			password: hashedPassword,
		},
	});

	await db.passwordResetToken.delete({
		where: {
			id: existingToken.id,
		},
	});

	return { success: 'Password updated' };
};
