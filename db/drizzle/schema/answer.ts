import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { question } from './question';

export const answer = pgTable('Answer', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	questionId: text('question_id').notNull(),
});

export const answerRelations = relations(answer, ({ one, many }) => ({
	question: one(question, {
		fields: [answer.questionId],
		references: [question.id],
	}),
}));

export type Answer = typeof answer.$inferSelect;
