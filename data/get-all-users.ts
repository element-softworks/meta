import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import Error from 'next/error';

export const getAllUsers = async ({
	pageNum,
	perPage,
	search,
}: {
	pageNum: number;
	perPage: number;
	search: string;
}) => {
	try {
		const currUser = await currentUser();

		if (!currUser) {
			return { error: 'You must be logged in to view users.' };
		}

		if (currUser && currUser.role !== UserRole.ADMIN) {
			return { error: 'You must be an admin to view users.' };
		}

		const users = await db.user.findMany({
			skip: (pageNum - 1) * perPage,
			take: perPage,
			orderBy: { createdAt: 'desc' },
			where: {
				OR: [
					{ name: { contains: search, mode: 'insensitive' } },
					{ email: { contains: search, mode: 'insensitive' } },
				],
			},
		});

		const totalUsers = await db.user.count();
		const totalPages = Math.ceil(totalUsers / perPage);

		return { success: 'Users retrieved successfully.', users: users, totalPages: totalPages };
	} catch (error: any) {
		return { error: error?.message ?? 'There was a problem retrieving users.' };
	}
};
