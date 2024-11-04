import { InferSelectModel, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const conciergeToken = pgTable('ConciergeToken', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	token: text('token').notNull(),
	expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	email: text('email').notNull(),
	name: text('name').notNull(),
});

export type ConciergeToken = InferSelectModel<typeof conciergeToken>;
