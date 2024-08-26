'use server';
import z from 'zod';
import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { currentUser } from '@/lib/auth';
import { getUserByEmail, getUserById } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
import bcrypt from 'bcryptjs';
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(user?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	if (user.isOAuth) {
		//As an oauth user, we can't update email and password and have no two factor authentication on app
		values.email = undefined;
		values.password = undefined;
		values.newPassword = undefined;
		values.isTwoFactorEnabled = undefined;
	}

	if (values.email && values.email !== dbUser.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) {
			return { error: 'Email already in use' };
		}

		// Generate a verification token and send it to the user via email
		const verificationToken = await generateVerificationToken(values.email);
		const data = await sendVerificationEmail(verificationToken);

		if (data.error) {
			return { error: data.error };
		}

		return { success: 'Confirmation email sent' };
	}

	if (values.password && values.newPassword && dbUser.password) {
		const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

		if (!passwordsMatch) {
			return { error: 'Invalid password' };
		}

		const hashedPassword = await bcrypt.hash(values.newPassword, 10);

		values.password = hashedPassword;
		values.newPassword = undefined;
	}

	await db.user.update({
		where: { id: user.id },
		data: {
			...values,
		},
	});

	return { success: 'Settings updated' };
};
