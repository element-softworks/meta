'use server';

import { revalidatePath } from 'next/cache';

export const revalidateData = async (path: string) => {
	revalidatePath(path);
	return { success: true };
};
