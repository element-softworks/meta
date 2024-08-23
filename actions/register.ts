'use server';

import { RegisterSchema } from '@/schemas';
import * as z from 'zod';

export const register = (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	return { success: 'User registered successfully.' };
};
