import { InferSelectModel, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const twoFactorToken = pgTable(
	'TwoFactorToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		email: text('email').notNull(),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('TwoFactorToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			tokenKey: uniqueIndex('TwoFactorToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export type TwoFactorToken = InferSelectModel<typeof twoFactorToken>;
