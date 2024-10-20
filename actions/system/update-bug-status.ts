'use server';

import { db } from '@/db/drizzle/db';
import { bug } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateBugStatus = async (status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS', bugId: string) => {
	const bugResponse = await db.update(bug).set({ status }).where(eq(bug.id, bugId));

	if (!bugResponse) {
		return { error: 'There was a problem updating the bug status, please try again later' };
	}

	revalidatePath('/dashboard/admin/bugs');

	return { success: 'Bug status updated.' };
};
