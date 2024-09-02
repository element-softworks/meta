'use server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import Error from 'next/error';

/**
 *
 * @param pageNum The page number to retrieve.
 * @param perPage The number of users to retrieve per page.
 * @param search The search query to filter users by.
 * @returns An object with the users and total pages.
 * @description This function retrieves all users from the database.
 * @example
 * const data = await getAllUsers({
 *  pageNum: 1,
 * perPage: 100,
 * search: 'John Doe',
 * });
 * console.log(data.totalPages, 'total pages');
 * @throws {Error} You must be logged in to view users.
 * @throws {Error} You must be an admin to view users.
 * @throws {Error} There was a problem retrieving users.
 * @returns {Object} An object with the users and total pages.
 * @name Get All Users
 * @type Function
 * @access protected
 */

export const getAllUsers = async ({
	pageNum,
	perPage,
	search,
	filters,
	showArchived,
}: {
	pageNum: number;
	perPage: number;
	search: string;
	showArchived: 'true' | 'false';
	filters: {
		name: 'neutral' | 'desc' | 'asc';
		email: 'asc' | 'desc' | 'neutral';
		emailVerified: 'asc' | 'desc' | 'neutral';
		isTwoFactorEnabled: 'asc' | 'desc' | 'neutral';
		role: 'asc' | 'desc' | 'neutral';
		createdAt: 'asc' | 'desc' | 'neutral';
	};
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
			orderBy: Object.entries(filters)
				?.filter?.(([_, value]) => value !== 'neutral' && !!value)
				?.map(([key, value]) => {
					return { [key]: value };
				}),
			where: {
				isArchived: showArchived === 'true',
				AND: {
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{ email: { contains: search, mode: 'insensitive' } },
						{ id: { equals: search } },
					],
				},
			},
		});

		const totalUsers = await db.user.count({
			where: {
				OR: [
					{ name: { contains: search, mode: 'insensitive' } },
					{ email: { contains: search, mode: 'insensitive' } },
					{ id: { equals: search } },
				],
			},
		});
		const totalPages = Math.ceil(totalUsers / perPage);

		return { success: 'Users retrieved successfully.', users: users, totalPages: totalPages };
	} catch (error: any) {
		return { error: error?.message ?? 'There was a problem retrieving users.' };
	}
};
