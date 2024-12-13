import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const fixtureType = pgTable('FixtureType', {
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
	images: text('images')
		.array()
		.default(sql`'{}'::text[]`)
		.notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
});

export type FixtureType = InferSelectModel<typeof fixtureType>;
