'use server';

import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetSchema } from '@/schemas';
import * as z from 'zod';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem resetting your password, please try again later' };
	}

	const { email } = validatedFields.data;

	const existingUser = await getUserByEmail(email);

	if (!existingUser) {
		return { error: 'User not found' };
	}

	// Generate a verification token and send it to the user via email
	const verificationToken = await generatePasswordResetToken(email);
	const data = await sendPasswordResetEmail(verificationToken);

	if (data.error) {
		return { error: data.error };
	}

	return { success: 'Confirmation email sent' };
};
