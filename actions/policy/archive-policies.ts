'use server';

import { db } from '@/db/drizzle/db';
import { policy, store } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const archivePolicies = async (policyIds: string[]) => {
	const authData = await checkPermissions({ admin: true });

	let restore = false;
	if (authData?.error) {
		return authData;
	} else {
		await db.transaction(async (transaction: any) => {
			for (const policyId of policyIds) {
				const [currentPolicy] = await transaction
					.select({ archivedAt: policy.archivedAt })
					.from(policy)
					.where(eq(policy.id, policyId));

				if (!!currentPolicy?.archivedAt) {
					restore = true;
				}

				await transaction
					.update(policy)
					.set({
						archivedAt: !!currentPolicy?.archivedAt ? null : new Date(),
						archivedBy: !!currentPolicy?.archivedAt ? null : authData?.user?.id ?? '',
						updatedAt: new Date(),
						updatedBy: authData?.user?.id ?? '',
					})
					.where(eq(policy.id, policyId));
			}
		});

		revalidatePath('/dashboard/policies');

		return {
			success: restore ? 'Policies restored successfully' : 'Policies archived successfully',
		};
	}
};
