import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { foreignKey, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './user';

export const userNotification = pgTable(
	'UserNotification',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		userId: text('userId').notNull(),
		title: text('title').notNull(),
		message: text('message').notNull(),
		readAt: timestamp('readAt', { precision: 3, mode: 'date' }),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
	},
	(table) => {
		return {
			userIdIdx: index('UserNotification_userId_idx').using(
				'btree',
				table.userId.asc().nullsLast()
			),
			userNotificationUserIdFkey: foreignKey({
				columns: [table.userId],
				foreignColumns: [user.id],
				name: 'UserNotification_userId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const userNotificationRelations = relations(userNotification, ({ one }) => ({
	user: one(user, {
		fields: [userNotification.userId],
		references: [user.id],
	}),
}));

export type UserNotification = InferSelectModel<typeof userNotification>;
