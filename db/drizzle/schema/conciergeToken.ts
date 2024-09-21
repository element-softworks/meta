import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { teamRole } from './team';

export const conciergeToken = pgTable(
	'ConciergeToken',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		token: text('token').notNull(),
		expiresAt: timestamp('expiresAt', { precision: 3, mode: 'date' }).notNull(),
		teamId: text('teamId').notNull(),
		email: text('email').notNull(),
		name: text('name').notNull(),
		role: teamRole('role').notNull(),
	},
	(table) => {
		return {
			emailTokenKey: uniqueIndex('ConciergeToken_email_token_key').using(
				'btree',
				table.email.asc().nullsLast(),
				table.token.asc().nullsLast()
			),
			teamIdEmailIdx: index('ConciergeToken_teamId_email_idx').using(
				'btree',
				table.teamId.asc().nullsLast(),
				table.email.asc().nullsLast()
			),
			tokenKey: uniqueIndex('ConciergeToken_token_key').using(
				'btree',
				table.token.asc().nullsLast()
			),
		};
	}
);
