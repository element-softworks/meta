import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { question } from './question';

export const answer = pgTable('Answer', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	questionId: text('question_id').notNull(),
	answer: text('answer'),
	metaChoiceId: text('meta_choice_id'),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdBy: text('createdBy').notNull(),
	updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedBy: text('updatedBy').notNull(),
	archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
	archivedBy: text('archivedBy'),
});

export const answerRelations = relations(answer, ({ one, many }) => ({
	question: one(question, {
		fields: [answer.questionId],
		references: [question.metaQuestionId],
	}),
}));

export type Answer = typeof answer.$inferSelect;
