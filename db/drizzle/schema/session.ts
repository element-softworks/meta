import { InferSelectModel, sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const session = pgTable('Session', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	endsAt: timestamp('endsAt', { precision: 3, mode: 'date' }),
	ipAddress: text('ipAddress'),
	isBot: boolean('isBot'),
	userAgent: text('userAgent'),
	browser: text('browser'),
	engine: text('engine'),
	os: text('os'),
	device: text('device'),
	cpu: text('cpu'),
	email: text('email'),
	deviceType: text('deviceType'),
});

export type Session = InferSelectModel<typeof session>;
