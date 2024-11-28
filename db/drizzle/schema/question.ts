import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { answer } from './answer';

export const answerType = pgEnum('AnswerType', [
	'MULTISELECT',
	'DROP_DOWN_SINGLE_SELECT',
	'IMAGE',
	'WHOLE_NUMBERS',
	'YES/NO',
	'OPEN_TEXT',
]);

export const question = pgTable('Question', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	category: text('category').notNull(),
	metaQuestionId: text('meta_question_id'),
	questionText: text('question').notNull(),
	answerType: answerType('answer_type').notNull(),
	note: text('note'),
	fixtureRelated: text('fixture_related'),
	labels: text('labels'),
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

export const questionRelations = relations(question, ({ one, many }) => ({
	answers: many(answer),
}));

export type Question = typeof question.$inferSelect;
