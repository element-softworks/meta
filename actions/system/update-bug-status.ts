'use server';

import { db } from '@/db/drizzle/db';
import { bug } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const updateBugStatus = async (status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS', bugId: string) => {
	const authUser = await currentUser();

	if (!authUser) {
		return { error: 'User not found' };
	}
	if (authUser?.role !== 'ADMIN') {
		return { error: 'Not authorized' };
	}
	const bugResponse = await db.update(bug).set({ status }).where(eq(bug.id, bugId));

	if (!bugResponse) {
		return { error: 'There was a problem updating the bug status, please try again later' };
	}

	revalidatePath('/dashboard/admin/bugs');

	return { success: 'Bug status updated.' };
};
