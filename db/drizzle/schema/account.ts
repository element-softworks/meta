import { InferSelectModel, relations, sql } from 'drizzle-orm';
import {
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './user';
import type { AdapterAccountType } from 'next-auth/adapters';

export const account = pgTable(
	'Account',
	{
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state'),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		userId: text('userId')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
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
