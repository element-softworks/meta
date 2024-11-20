import { InferSelectModel, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const verificationToken = pgTable(
	'VerificationToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		email: text('email').notNull(),
		newEmail: text('newEmail'),
		name: text('name'),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('VerificationToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			newEmailTokenIdx: index('VerificationToken_newEmail_token_idx').using(
				'btree',
				table.newEmail.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			tokenKey: uniqueIndex('VerificationToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);

export type VerificationToken = InferSelectModel<typeof verificationToken>;
