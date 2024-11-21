import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const bug = pgTable('Bug', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	images: text('images')
		.array()
		.default(sql`'{}'::text[]`)
		.notNull(),
	status: text('status').default('OPEN').notNull(),
	title: text('title').notNull(),
	description: text('comment').notNull(),
});

export type Bug = InferSelectModel<typeof bug>;
