'use server';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { ChangeEmailSchema } from '@/schemas';
import z from 'zod';
export const emailChangeStart = async (values: z.infer<typeof ChangeEmailSchema>) => {
	const user = await currentUser();

	if (!user) {
		return { error: 'Unauthorized' };
	}

	const dbUser = await getUserById(user?.id ?? '');

	if (!dbUser) {
		return { error: 'Unauthorized' };
	}

	if (user.isOAuth) {
		return { error: 'Cannot update email as OAuth user' };
	}

	if (values.email && values.email !== dbUser.email) {
		const existingUser = await getUserByEmail(values.email);

		if (existingUser && existingUser.id !== user.id) {
			return { error: 'Email already in use' };
		}

		// Generate a verification token and send it to the user via email
		const verificationToken = await generateVerificationToken(dbUser.email, values.email);
		const data = await sendVerificationEmail(verificationToken);

		if (data.error) {
			return { error: data.error };
		}

		return { success: 'Confirmation email sent' };
	}

	return { success: 'Email already being used' };
};
