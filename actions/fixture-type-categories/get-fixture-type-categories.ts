'use server';

import { db } from '@/db/drizzle/db';
import { fixtureTypeCategory } from '@/db/drizzle/schema';
import { FixtureTypeCategory } from '@/db/drizzle/schema/fixtureTypeCategory';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, isNull, not, sql } from 'drizzle-orm';

export const getFixtureTypeCategories = async (
	perPage: number,
	pageNum: number,
	search?: string,
	showArchived?: boolean
) => {
	const authResponse = await checkPermissions({ admin: false });

	if (authResponse?.error) {
		return authResponse;
	} else {
		try {
			const foundFixtureTypeCategories = await db
				.select()
				.from(fixtureTypeCategory)
				.where(
					and(
						!showArchived
							? isNull(fixtureTypeCategory.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(fixtureTypeCategory.archivedAt))
							: isNull(fixtureTypeCategory.archivedAt),
						!!search?.length
							? sql`lower(${
									fixtureTypeCategory.name
							  }) like ${`%${search.toLowerCase()}%`}`
							: undefined
					)
				)
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(fixtureTypeCategory.createdAt));

			const [totalFixtureTypeCategories] = await db
				.select({ count: count() })
				.from(fixtureTypeCategory)
				.where(
					and(
						!showArchived
							? isNull(fixtureTypeCategory.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(fixtureTypeCategory.archivedAt))
							: isNull(fixtureTypeCategory.archivedAt),
						!!search?.length
							? sql`lower(${
									fixtureTypeCategory.name
							  }) like ${`%${search.toLowerCase()}%`}`
							: undefined
					)
				);

			const totalPages = Math.ceil(totalFixtureTypeCategories.count / Number(perPage));

			return {
				success: true,
				fixtureTypeCategories: foundFixtureTypeCategories,
				totalPages: totalPages,
				total: totalFixtureTypeCategories.count,
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'An error occurred retrieving the fixture type categories, please try again later.',
			};
		}
	}
};

export interface FixtureTypeCategoriesResponse {
	success: boolean;
	fixtureTypeCategories: FixtureTypeCategory[];
	totalPages: number;
	total: number;
}
