import { db } from '@/db/drizzle/db';
import { policy, policyQuestion, storeGeolocation, user } from '@/db/drizzle/schema';
import { Policy } from '@/db/drizzle/schema/policy';
import { Question, question } from '@/db/drizzle/schema/question';
import { Store, store } from '@/db/drizzle/schema/store';
import { User } from '@/db/drizzle/schema/user';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, isNull, not, sql } from 'drizzle-orm';

export const getPolicies = async (
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
		const foundPolicies = await db
			.select({
				policy: {
					...policy,
					createdBy: sql`jsonb_build_object(
						'id', ${user.id},
						'email', ${user.email},
						'name', ${user.name},
						'image', ${user.image}
					)`.as('createdBy'),
				},
				countries: sql<Array<string>>`
					json_agg(
						DISTINCT ${storeGeolocation.country}
					) FILTER (WHERE ${storeGeolocation.country} IS NOT NULL AND ${store.archivedAt} IS NULL)
				`.as('countries'),
				stores: sql<Array<Store>>`
					json_agg(
						DISTINCT jsonb_build_object(
							'id', ${store.id},
							'name', ${store.name},
							'createdAt', ${store.createdAt},
							'archivedAt', ${store.archivedAt},
							'contactEmail', ${store.contactEmail},
							'contactPhone', ${store.contactPhone},
							'maxCapacity', ${store.maxCapacity},
							'openingTimes', ${store.openingTimes},
							'updatedAt', ${store.updatedAt}
						)
					) FILTER (WHERE ${store.id} IS NOT NULL AND ${store.archivedAt} IS NULL)
				`.as('stores'),
				questions: sql<Array<Question>>`
					json_agg(
						DISTINCT jsonb_build_object(
							'id', ${question.id},
							'questionText', ${question.questionText},
							'answerType', ${question.answerType},
							'category', ${question.category},
							'createdAt', ${question.createdAt},
							'updatedAt', ${question.updatedAt},
							'archivedAt', ${question.archivedAt}
						)
					) FILTER (WHERE ${question.id} IS NOT NULL AND ${question.archivedAt} IS NULL)
				`.as('questions'),
			})
			.from(policy)
			.leftJoin(store, eq(store.policyId, policy.id))
			.leftJoin(policyQuestion, eq(policyQuestion.policyId, policy.id))
			.leftJoin(question, eq(question.id, policyQuestion.questionId))
			.leftJoin(storeGeolocation, eq(storeGeolocation.storeId, store.id))
			.leftJoin(user, eq(user.id, policy.createdBy))
			.where(
				and(
					!showArchived
						? isNull(policy.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(policy.archivedAt))
						: isNull(policy.archivedAt),
					!!search?.length
						? sql`lower(${policy.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			)
			.groupBy(policy.id, user.id)
			.orderBy(desc(policy.createdAt))
			.limit(Number(perPage))
			.offset((Number(pageNum) - 1) * Number(perPage));

		// Count query
		const [totalPolicies] = await db
			.select({ count: count() })
			.from(policy)
			.where(
				and(
					!showArchived
						? isNull(policy.archivedAt)
						: authResponse?.user?.role === 'ADMIN'
						? not(isNull(policy.archivedAt))
						: isNull(policy.archivedAt),
					!!search?.length
						? sql`lower(${policy.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
			);

		const totalPages = Math.ceil(totalPolicies.count / Number(perPage));

		// Transform results into the desired nested structure
		const groupedPolicies = foundPolicies.map((row) => ({
			policy: {
				...row.policy,
				stores: row.stores ?? [],
				questions: row.questions ?? [],
				countries: row.countries ?? [],
			},
		}));

		return {
			success: true,
			policies: groupedPolicies,
			totalPages,
			total: totalPolicies.count,
		};
	} catch (error) {
		console.error(error);
		return {
			error: 'An error occurred retrieving the policies, please try again later.',
		};
	}
};

export interface PoliciesResponse {
	success: boolean;
	policies: {
		policy: Policy & {
			stores: Store[];
			questions: Question[];
			countries: string[];
			createdBy: User;
		};
	}[];
	totalPages: number;
	total: number;
}
