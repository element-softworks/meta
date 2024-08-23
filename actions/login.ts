'use server';

import * as z from 'zod';
import { LoginSchema } from '@/schemas';

export const login = (values: z.infer<typeof LoginSchema>) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem logging in, check your credentials and try again.' };
	}

	return { success: 'User logged in successfully.' };
};
