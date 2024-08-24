'use server';

import { RegisterSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	const { email, password, name } = validatedFields.data;
	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: 'A user with that email already exists.' };
	}

	await db.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
		},
	});

	// Generate a verification token and send it to the user via email
	const verificationToken = await generateVerificationToken(email);
	await sendVerificationEmail(verificationToken);

	return { success: 'Confirmation email sent.' };
};
