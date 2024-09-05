'use server';

import { TeamsSchema } from '@/schemas';
import * as z from 'zod';
export const teamCreate = async (formData: FormData) => {
	type TeamType = z.infer<typeof TeamsSchema>;

	const image = formData.get('image');
	const name = formData.get('name');

	const values = {
		image: image,
		name: name,
	};

	console.log(image, name, 'values');

	const validatedFields = TeamsSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	return { success: 'team created' };
};
