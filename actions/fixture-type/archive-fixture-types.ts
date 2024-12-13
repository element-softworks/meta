'use server';

import { db } from '@/db/drizzle/db';
import { fixtureType, store } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const archiveFixtureTypes = async (fixtureIds: string[]) => {
	const authData = await checkPermissions({ admin: true });

	let restore = false;
	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (transaction: any) => {
			for (const fixtureId of fixtureIds) {
				const [currentFixture] = await transaction
					.select({ archivedAt: fixtureType.archivedAt })
					.from(fixtureType)
					.where(eq(fixtureType.id, fixtureId));

				if (!!currentFixture?.archivedAt) {
					restore = true;
				}

				await transaction
					.update(fixtureType)
					.set({
						archivedAt: !!currentFixture?.archivedAt ? null : new Date(),
						archivedBy: !!currentFixture?.archivedAt ? null : authData?.user?.id ?? '',
						updatedAt: new Date(),
						updatedBy: authData?.user?.id ?? '',
					})
					.where(eq(fixtureType.id, fixtureId));
			}
		});

		revalidatePath('/dashboard/admin/fixture-types');

		return {
			success: restore
				? 'Fixture type restored successfully'
				: 'Fixture type archived successfully',
		};
	}
};
