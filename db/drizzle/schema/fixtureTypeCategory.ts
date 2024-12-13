import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const fixtureTypeCategory = pgTable('FixtureTypeCategory', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdBy: text('createdBy').notNull(),
	archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
	archivedBy: text('archivedBy'),
	name: text('name').notNull(),
});

export type FixtureTypeCategory = InferSelectModel<typeof fixtureTypeCategory>;
