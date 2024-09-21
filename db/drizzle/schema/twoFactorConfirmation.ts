import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { foreignKey, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './user';

export const twoFactorConfirmation = pgTable(
	'TwoFactorConfirmation',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		userId: text('userId').notNull(),
	},
	(table) => {
		return {
			userIdKey: uniqueIndex('TwoFactorConfirmation_userId_key').using(
				'btree',
				table.userId.asc().nullsLast()
			),
			twoFactorConfirmationUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'TwoFactorConfirmation_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const twoFactorConfirmationRelations = relations(twoFactorConfirmation, ({ one }) => ({
	user: one(user, {
		fields: [twoFactorConfirmation.userId],
		references: [user.id],
	}),
}));

export type TwoFactorConfirmation = InferSelectModel<typeof twoFactorConfirmation>;
