import { relations, sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { policy } from './policy';
import { question } from './question';
import { store } from './store';

export const storeQuestion = pgTable('StoreQuestion', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	questionId: text('questionId')
		.notNull()
		.references(() => question.id, { onDelete: 'cascade' }),
	storeId: text('storeId')
		.notNull()
		.references(() => policy.id, { onDelete: 'cascade' }),
	answerId: text('answerId').references(() => question.id, { onDelete: 'cascade' }),
});

export const storeQuestionRelations = relations(storeQuestion, ({ one, many }) => ({
	question: one(question, {
		fields: [storeQuestion.questionId],
		references: [question.id],
	}),
	policy: one(store, {
		fields: [storeQuestion.storeId],
		references: [store.id],
	}),
	answerId: one(question, {
		fields: [storeQuestion.answerId],
		references: [question.id],
	}),
}));

export type StoreQuestion = typeof storeQuestion.$inferSelect;
