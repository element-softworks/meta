import { relations, sql } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { policy } from './policy';
import { store } from './store';

export const policyStore = pgTable('PolicyStore', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	storeId: text('questionId')
		.notNull()
		.references(() => store.id, { onDelete: 'cascade' }),
	policyId: text('policyId')
		.notNull()
		.references(() => policy.id, { onDelete: 'cascade' }),
});

export const policyStoreRelations = relations(policyStore, ({ one, many }) => ({
	store: one(store, {
		fields: [policyStore.storeId],
		references: [store.id],
	}),
	policy: one(policy, {
		fields: [policyStore.policyId],
		references: [policy.id],
	}),
}));

export type PolicyStore = typeof policyStore.$inferSelect;
