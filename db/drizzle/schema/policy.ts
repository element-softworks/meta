import { relations, sql } from 'drizzle-orm';
import { policyQuestion } from './policyQuestion';
import { store } from './store';
import { pgTable, text, timestamp, PgArray, jsonb } from 'drizzle-orm/pg-core';

export const policy = pgTable('Policy', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	name: text('name').notNull(),
	countries: jsonb('countries')
		.notNull()
		.default(sql`'[]'::jsonb`),
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

export const policyRelations = relations(policy, ({ one, many }) => ({
	questions: many(policyQuestion),
	stores: many(store),
}));

export type Policy = typeof policy.$inferSelect;
