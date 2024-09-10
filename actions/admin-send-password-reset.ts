'use server';
import { getAccountByUserId } from '@/data/account';
import { getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ExtendedUser } from '@/next-auth';
import { UserRole } from '@prisma/client';
import { User } from 'next-auth';

export const adminSendPasswordReset = async (editingUserId: string) => {
	const adminUser = await currentUser();
	const resetUser = await getUserById(editingUserId ?? '');

	if (!adminUser || !resetUser) {
		return { error: 'User not found' };
	}

	if (adminUser.role !== UserRole.ADMIN) {
		return { error: 'Unauthorized' };
	}

	const isOAuth = await getAccountByUserId(resetUser.id);
	if (isOAuth) {
		return { error: 'User is registered with a provider, cannot reset password here' };
	}

	// Generate a verification token and send it to the user via email
	const verificationToken = await generatePasswordResetToken(resetUser.email);
	const data = await sendPasswordResetEmail(verificationToken);

	if (data.error) {
		return { error: data.error };
	}

	return { success: `Reset password email sent to ${resetUser.email ?? 'user'}` };
};
