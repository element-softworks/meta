import { relations, sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { policy } from './policy';
import { question } from './question';

export const policyQuestion = pgTable('PolicyQuestion', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	questionId: text('questionId').notNull(),
	policyId: text('policyId').notNull(),
});

export const policyQuestionRelations = relations(policyQuestion, ({ one, many }) => ({
	question: one(question, {
		fields: [policyQuestion.questionId],
		references: [question.id],
	}),
	policy: one(policy, {
		fields: [policyQuestion.policyId],
		references: [policy.id],
	}),
}));

export type PolicyQuestion = typeof policyQuestion.$inferSelect;
