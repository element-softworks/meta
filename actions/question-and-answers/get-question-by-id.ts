'use server';

import { db } from '@/db/drizzle/db';
import { answer, question } from '@/db/drizzle/schema';
import { Answer } from '@/db/drizzle/schema/answer';
import { Question } from '@/db/drizzle/schema/question';
import { eq } from 'drizzle-orm';

export const getQuestionById = async (id: string) => {
	// Fetch all question and answer pairs
	const rows = await db
		.select()
		.from(question)
		.leftJoin(answer, eq(question.metaQuestionId, answer.questionId))
		.where(eq(question.id, id));

	const grouped: QuestionResponse = {
		question: {
			...rows[0].Question,
			answers: rows
				.filter((row) => row.Answer?.questionId === row.Question?.metaQuestionId)
				.map((row) => ({
					...row.Answer,
					createdAt: row.Answer?.createdAt ?? new Date(),
					id: row.Answer?.id ?? '',
					questionId: row.Answer?.questionId ?? '',
					updatedAt: row.Answer?.updatedAt ?? new Date(),
					updatedBy: row.Answer?.updatedBy ?? '',
					createdBy: row.Answer?.createdBy ?? '',
					archivedAt: row.Answer?.archivedAt ?? new Date(),
					archivedBy: row.Answer?.archivedBy ?? '',
					answer: row.Answer?.answer ?? '',
					metaChoiceId: row.Answer?.metaChoiceId ?? '',
				})),
		},
	};
	return grouped;
};

export interface QuestionResponse {
	question: Question & { answers: Answer[] };
}
