import { InferSelectModel, relations, sql } from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user';

export const account = pgTable(
	'Account',
	{
		userId: text('userId').notNull(),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refreshToken: text('refresh_token'),
		accessToken: text('access_token'),
		expiresAt: integer('expires_at'),
		tokenType: text('token_type'),
		scope: text('scope'),
		idToken: text('id_token'),
		sessionState: text('session_state'),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			userIdIdx: index('Account_userId_idx').using('btree', table.userId.asc().nullsLast()),
			accountUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'Account_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
			accountPkey: primaryKey({
				columns: [table.provider, table.providerAccountId],
				name: 'Account_pkey',
			}),
		};
	}
);

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export type Account = InferSelectModel<typeof account>;
