'use server';
import { db } from '@/db/drizzle/db';
import { account, user } from '@/db/drizzle/schema';
import { currentUser } from '@/lib/auth';
import { and, asc, count, desc, eq, or, sql } from 'drizzle-orm';

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
		createdAt: 'asc' | 'desc' | 'neutral';
	};
}) => {
	try {
		const currUser = await currentUser();

		if (!currUser) {
			return { error: 'You must be logged in to view users.' };
		}

		if (currUser && currUser.role !== 'ADMIN') {
			return { error: 'You must be an admin to view users.' };
		}

		const usersResponse = await db
			.select({
				user: {
					...user,
				},
				provider: account,
			})
			.from(user)
			.limit(perPage)
			.offset((pageNum - 1) * perPage)
			.where(
				and(
					eq(user.isArchived, showArchived === 'true'),
					or(
						sql`lower(${user.name}) like ${`%${search.toLowerCase()}%`}`,
						sql`lower(${user.email}) like ${`%${search.toLowerCase()}%`}`,
						sql`lower(${user.id}) like ${`%${search.toLowerCase()}%`}`
					)
				)
			)
			.leftJoin(account, eq(user.id, account.userId))
			.orderBy(filters.createdAt === 'asc' ? asc(user.createdAt) : desc(user.createdAt));

		const [userResponseCount] = await db
			.select({ count: count() })
			.from(user)
			.where(
				or(
					sql`lower(${user.name}) like ${`%${search.toLowerCase()}%`}`,
					sql`lower(${user.email}) like ${`%${search.toLowerCase()}%`}`,
					sql`lower(${user.id}) like ${`%${search.toLowerCase()}%`}`
				)
			);

		const totalPages = Math.ceil(userResponseCount.count / perPage);

		console.log(usersResponse, 'usersresponse');
		return {
			success: 'Users retrieved successfully.',
			users: usersResponse,
			totalPages: totalPages,
		};
	} catch (error: any) {
		return { error: error?.message ?? 'There was a problem retrieving users.' };
	}
};
