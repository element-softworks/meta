'use server';

import { db } from '@/db/drizzle/db';
import { store } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const archiveStores = async (storeIds: string[]) => {
	const authData = await checkPermissions({ admin: true });

	let restore = false;
	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (transaction: any) => {
			for (const storeId of storeIds) {
				const [currentStore] = await transaction
					.select({ archivedAt: store.archivedAt })
					.from(store)
					.where(eq(store.id, storeId));

				if (!!currentStore?.archivedAt) {
					restore = true;
				}

				await transaction
					.update(store)
					.set({
						archivedAt: !!currentStore?.archivedAt ? null : new Date(),
						archivedBy: !!currentStore?.archivedAt ? null : authData?.user?.id ?? '',
						updatedAt: new Date(),
						updatedBy: authData?.user?.id ?? '',
					})
					.where(eq(store.id, storeId));
			}
		});

		revalidatePath('/dashboard/stores');

		return {
			success: restore ? 'Stores restored successfully' : 'Stores archived successfully',
		};
	}
};
