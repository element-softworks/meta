import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { answer } from './answer';

export const answerType = pgEnum('AnswerType', [
	'MULTISELECT',
	'DROPDOWN_SINGLE_SELECT',
	'IMAGE',
	'WHOLE_NUMBERS',
	'YES/NO',
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
});

export const questionRelations = relations(question, ({ one, many }) => ({
	answers: many(answer),
}));

export type Question = typeof question.$inferSelect;
