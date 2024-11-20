'use server';

import { getUserByEmail } from '@/data/user';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { ConciergeToken } from '@/db/drizzle/schema/conciergeToken';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const register = async (
	values: z.infer<typeof RegisterSchema>,
	token?: ConciergeToken | null | {},
	skipHash?: boolean,
	coach?: boolean
) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	const { email, password, name } = validatedFields.data;
	let hashedPassword = password;

	if (!skipHash) {
		hashedPassword = await bcrypt.hash(password, 10);
	}

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: 'A user with that email already exists.', user: existingUser };
	}

	const [newUser] = await db
		.insert(user)
		.values({
			email,
			name,
			password: hashedPassword,
			updatedAt: new Date(),
		})
		.returning({ id: user.id,name: user.name});

	// Generate a verification token and send it to the user via email
	const verificationToken = await generateVerificationToken(newUser?.name ?? '',email);
	const data = await sendVerificationEmail(verificationToken, coach);

	if (data.error) {
		return { error: data.error };
	}

	return { success: 'Confirmation email sent.', user: newUser };
};
