import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, index, pgEnum, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { userNotification } from './userNotification';
import { twoFactorConfirmation } from './twoFactorConfirmation';
import { account } from './account';
import { customerInvoice } from './customerInvoice';
export const userRole = pgEnum('UserRole', ['ADMIN', 'USER']);

export const user = pgTable(
	'User',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		name: text('name'),
		agreedToMarketing: boolean('agreedToMarketing').default(false).notNull(),
		email: text('email').notNull(),
		stripeCustomerId: text('stripeCustomerId'),
		stripePaymentId: text('stripePaymentId'),
		emailVerified: timestamp('emailVerified', { precision: 3, mode: 'date' }),
		image: text('image'),
		password: text('password'),
		coachId: text('coachId'),
		role: userRole('role').default('USER').notNull(),
		isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false).notNull(),
		isArchived: boolean('isArchived').default(false).notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).default(
			sql`CURRENT_TIMESTAMP`
		),
		lastLogin: timestamp('lastLogin', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		notificationsEnabled: boolean('notificationsEnabled').default(true).notNull(),
	},
	(table) => {
		return {
			emailKey: uniqueIndex('User_email_key').using('btree', table.email.asc().nullsLast()),
			emailNameIdx: index('User_email_name_idx').using(
				'btree',
				table.email.asc().nullsLast(),
				table.name.asc().nullsLast()
			),
		};
	}
);

export const userRelations = relations(user, ({ many, one }) => ({
	userNotifications: many(userNotification),
	twoFactorConfirmations: many(twoFactorConfirmation),
	userInvoices: many(customerInvoice),
	accounts: many(account),
}));

export type User = InferSelectModel<typeof user>;
