import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { policy } from './policy';

export const assessment = pgTable('Assessment', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	policyId: text('policy_id').notNull(),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdBy: text('created_by').notNull(),
	updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedBy: text('updated_by').notNull(),
	archivedAt: timestamp('archived_at', { precision: 3, mode: 'date' }),
	archivedBy: text('archived_by'),
});

export const assessmentRelations = relations(assessment, ({ one, many }) => ({
	policy: one(policy, {
		fields: [assessment.policyId],
		references: [policy.id],
	}),
}));

export type Assessment = typeof assessment.$inferSelect;
