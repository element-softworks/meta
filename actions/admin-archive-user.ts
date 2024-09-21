'use server';
import { signOut } from '@/auth';
import { TableUser } from '@/components/tables/users-table';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { User, UserRole } from '@prisma/client';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const adminArchiveUser = async (archivingUser?: User | TableUser) => {
	const adminUser = await currentUser();

	if (!adminUser || !archivingUser) {
		return { error: 'User not found' };
	}

	if (adminUser.role !== UserRole.ADMIN) {
		return { error: 'Unauthorized' };
	}

	// Archive the user
	const [archivedUser] = await db
		.update(user)
		.set({
			isArchived: archivingUser.isArchived ? false : true,
		})
		.where(eq(user.id, archivingUser.id))
		.returning({ id: user.id, isArchived: user.isArchived });

	if (!archivedUser) {
		return { error: 'Failed to archive user' };
	}

	if (archivedUser.isArchived && archivedUser.id === adminUser.id) {
		return signOut();
	}

	revalidatePath(`/dashboard/admin/users/${archivingUser.id}`);

	return {
		success: `User "${archivingUser.name}" ${
			archivingUser.isArchived ? 'restored' : 'archived'
		}`,
	};
};
