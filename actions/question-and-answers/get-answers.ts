'use server';

import { db } from '@/db/drizzle/db';
import { answer } from '@/db/drizzle/schema';
import { Answer } from '@/db/drizzle/schema/answer';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, isNull, not, or, sql } from 'drizzle-orm';

export const getAnswers = async (
	perPage: number,
	pageNum: number,
	search?: string,
	showArchived?: boolean,
	questionId?: string
) => {
	const authResponse = await checkPermissions({ admin: false });

	if (authResponse?.error) {
		return authResponse;
	} else {
		try {
			const foundAnswers = await db
				.select()
				.from(answer)
				.where(
					and(
						!showArchived
							? isNull(answer.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(answer.archivedAt))
							: isNull(answer.archivedAt),
						!!search?.length
							? or(sql`lower(${answer.answer}) like ${`%${search.toLowerCase()}%`}`)
							: undefined,

						!!questionId?.length ? eq(answer.questionId, questionId) : undefined
					)
				)
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(answer.createdAt));

			const [totalAnswers] = await db
				.select({ count: count() })
				.from(answer)
				.where(
					and(
						!showArchived
							? isNull(answer.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(answer.archivedAt))
							: isNull(answer.archivedAt),
						!!search?.length
							? or(sql`lower(${answer.answer}) like ${`%${search.toLowerCase()}%`}`)
							: undefined,
						!!questionId?.length ? eq(answer.questionId, questionId) : undefined
					)
				);

			const totalPages = Math.ceil(totalAnswers.count / Number(perPage));

			return {
				success: true,
				answers: foundAnswers,
				totalPages: totalPages,
				total: totalAnswers.count,
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'An error occurred retrieving the answers, please try again later.',
			};
		}
	}
};

export interface AnswersResponse {
	success: boolean;
	answers: Answer[];
	totalPages: number;
	total: number;
}
