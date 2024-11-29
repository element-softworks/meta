'use server';

import { db } from '@/db/drizzle/db';
import { question } from '@/db/drizzle/schema';
import { Question } from '@/db/drizzle/schema/question';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, isNull, not, or, sql } from 'drizzle-orm';

export const getQuestions = async (
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
			const foundQuestions = await db
				.select()
				.from(question)
				.where(
					and(
						!showArchived
							? isNull(question.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(question.archivedAt))
							: isNull(question.archivedAt),
						!!search?.length
							? or(
									sql`lower(${
										question.category
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.questionText
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.note
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.fixtureRelated
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.labels
									}) like ${`%${search.toLowerCase()}%`}`
							  )
							: undefined
					)
				)
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(question.createdAt));

			const [totalQuestions] = await db
				.select({ count: count() })
				.from(question)
				.where(
					and(
						!showArchived
							? isNull(question.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(question.archivedAt))
							: isNull(question.archivedAt),
						!!search?.length
							? or(
									sql`lower(${
										question.category
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.questionText
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.note
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.fixtureRelated
									}) like ${`%${search.toLowerCase()}%`}`,
									sql`lower(${
										question.labels
									}) like ${`%${search.toLowerCase()}%`}`
							  )
							: undefined
					)
				);

			const totalPages = Math.ceil(totalQuestions.count / Number(perPage));

			return {
				success: true,
				questions: foundQuestions,
				totalPages: totalPages,
				total: totalQuestions.count,
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'An error occurred retrieving the questions, please try again later.',
			};
		}
	}
};

export interface QuestionResponse {
	success: boolean;
	questions: Question[];
	totalPages: number;
	total: number;
}
