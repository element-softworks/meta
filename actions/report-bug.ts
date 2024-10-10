'use server';

import { db } from '@/db/drizzle/db';
import { bug } from '@/db/drizzle/schema';
import { ReportBugSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

export const reportBug = async (values: z.infer<typeof ReportBugSchema>) => {
	const validatedFields = ReportBugSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
	}

	const { title, description, status } = validatedFields.data;

	await db.insert(bug).values({
		title,
		description,
		status,
	});

	revalidatePath('/dashboard/admin/bugs');

	return { success: 'Confirmation email sent.' };
};
