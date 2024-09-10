'use server';

import { addUserToTeam } from '@/data/team';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';
import { ConciergeToken } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as z from 'zod';

export const register = async (
	values: z.infer<typeof RegisterSchema>,
	token?: ConciergeToken | null
) => {
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

	const newUser = await db.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
		},
	});

	//If the user is registering from a concierge email team invite, we need to add them to the team
	if (!!token?.teamId) {
		//Check if the token is still valid
		if (token.expiresAt < new Date()) {
			//Destroy the concierge token
			await db.conciergeToken.delete({
				where: {
					id: token.id,
				},
			});
			return {
				error: 'Your invite token has expired, please contact the team for another invite',
			};
		}

		try {
			await addUserToTeam(token.teamId, newUser.id, token.role);
		} catch (error) {
			return { error: 'There was a problem registering, please try again later' };
		}

		//Destroy the concierge token
		await db.conciergeToken.delete({
			where: {
				id: token.id,
			},
		});
	}

	// Generate a verification token and send it to the user via email
	const verificationToken = await generateVerificationToken(email);
	const data = await sendVerificationEmail(verificationToken);

	if (data.error) {
		return { error: data.error };
	}

	return { success: 'Confirmation email sent.' };
};
