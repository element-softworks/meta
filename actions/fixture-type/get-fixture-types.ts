import { FixtureType } from './../../db/drizzle/schema/fixtureType';
import { db } from '@/db/drizzle/db';
import { fixtureType, policy, policyQuestion, storeGeolocation, user } from '@/db/drizzle/schema';
import { Policy } from '@/db/drizzle/schema/policy';
import { Question, question } from '@/db/drizzle/schema/question';
import { Store, store } from '@/db/drizzle/schema/store';
import { User } from '@/db/drizzle/schema/user';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, isNull, not, sql } from 'drizzle-orm';

export const getFixtureTypes = async (
	perPage: number,
	pageNum: number,
	search?: string,
	showArchived?: boolean
) => {
	const authResponse = await checkPermissions({ admin: false });

	if (authResponse?.error) {
		return authResponse;
	}

	try {
		// Main query to fetch policies with aggregated stores and questions
		const foundFixtures = await db
			.select()
			.from(fixtureType)
			.where(
				and(
					!showArchived
						? isNull(fixtureType.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(fixtureType.archivedAt))
						: isNull(fixtureType.archivedAt),
					!!search?.length
						? sql`lower(${fixtureType.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			)
			.orderBy(desc(fixtureType.createdAt))
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage));

		// Count query
		const [totalFixtures] = await db
			.select({ count: count() })
			.from(fixtureType)
			.where(
				and(
					!showArchived
						? isNull(fixtureType.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(fixtureType.archivedAt))
						: isNull(fixtureType.archivedAt),
					!!search?.length
						? sql`lower(${fixtureType.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			);

		const totalPages = Math.ceil(totalFixtures.count / Number(perPage));

		return {
			success: true,
			fixtureTypes: foundFixtures,
			totalPages,
			total: totalFixtures.count,
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred retrieving the policies, please try again later.',
		};
	}
};

export interface FixtureTypesResponse {
	success: boolean;
	fixtureTypes: FixtureType[];
	totalPages: number;
	total: number;
}
