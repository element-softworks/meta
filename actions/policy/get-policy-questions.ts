'use server';

import { db } from '@/db/drizzle/db';
import { answer, policyQuestion, question } from '@/db/drizzle/schema';
import { Answer } from '@/db/drizzle/schema/answer';
import { PolicyQuestion } from '@/db/drizzle/schema/policyQuestion';
import { Question } from '@/db/drizzle/schema/question';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, isNull, not, or, sql } from 'drizzle-orm';

export const getPolicyQuestions = async (
	policyId: string,
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
				.select({
					question: question,
					policyQuestion: policyQuestion,
					answers: sql`json_agg(${answer}) as answers`,
				})
				.from(policyQuestion)
				.where(
					and(
						eq(policyQuestion.policyId, policyId),
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
				.leftJoin(question, eq(policyQuestion.questionId, question.id))
				.leftJoin(answer, eq(answer.questionId, question.metaQuestionId))
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(question.createdAt))
				.groupBy(question.id, policyQuestion.id);

			const [totalQuestions] = await db
				.select({ count: count() })
				.from(policyQuestion)
				.where(
					and(
						eq(policyQuestion.policyId, policyId),

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
				.leftJoin(question, eq(policyQuestion.questionId, question.id));

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

export interface PolicyQuestionsResponse {
	success: boolean;
	questions: {
		question: Question | null;
		policyQuestion: PolicyQuestion;
		answers: Answer[];
	}[];
	totalPages: number;
	total: number;
}
