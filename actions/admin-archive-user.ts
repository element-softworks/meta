'use server';
import { signOut } from '@/auth';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { ExtendedUser } from '@/next-auth';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const adminArchiveUser = async (archivingUser: ExtendedUser) => {
	const adminUser = await currentUser();

	if (!adminUser || !archivingUser) {
		return { error: 'User not found' };
	}

	if (adminUser.role !== UserRole.ADMIN) {
		return { error: 'Unauthorized' };
	}

	// Archive the user
	const archivedUser = await db.user.update({
		where: { id: archivingUser.id },
		data: {
			isArchived: archivingUser.isArchived ? false : true,
		},
	});

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
