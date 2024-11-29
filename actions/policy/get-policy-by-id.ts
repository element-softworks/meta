'use server';

import { db } from '@/db/drizzle/db';
import {
	policy,
	policyQuestion,
	question,
	store,
	storeGeolocation,
	user,
} from '@/db/drizzle/schema';
import { Policy } from '@/db/drizzle/schema/policy';
import { Question } from '@/db/drizzle/schema/question';
import { Store } from '@/db/drizzle/schema/store';
import { eq, sql } from 'drizzle-orm';
import { User } from 'next-auth';

export const getPolicyById = async (id: string) => {
	const [policyResponse] = await db
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
			positions: sql`
					json_agg(
						DISTINCT jsonb_build_object(
							'id', ${storeGeolocation.id},
							'longitude', ${storeGeolocation.longitude},
							'latitude', ${storeGeolocation.latitude},
							'country', ${storeGeolocation.country}
						)
					) FILTER (WHERE ${storeGeolocation.id} IS NOT NULL AND ${store.archivedAt} IS NULL)
				`.as('stores'),
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
		.where(eq(policy.id, id))
		.groupBy(policy.id, user.id);

	return policyResponse as PolicyResponse;
};

export interface PolicyResponse {
	positions: {
		id: string;
		longitude: number;
		latitude: number;
		country: string;
	}[];

	questions: Question[];
	stores: Store[];
	countries: string[];

	policy: Policy & {
		createdBy: User;
	};
}
