import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customerInvoice } from './customerInvoice';
import { user } from './user';

export const customer = pgTable('Customer', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	userId: text('userId').notNull(),
	stripeCustomerId: text('stripeCustomerId').notNull(),
	stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
	startDate: timestamp('startDate', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	endDate: timestamp('endDate', { precision: 3, mode: 'date' }),
	planId: text('planId').notNull(),
	email: text('email').notNull(),
	status: text('status').notNull(),
	cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull(),
	type: text('type').notNull().default('subscription'),
});

export const customerRelations = relations(customer, ({ one, many }) => ({
	user: one(user, {
		fields: [customer.userId],
		references: [user.id],
	}),
	customerInvoices: many(customerInvoice),
}));

export type Customer = InferSelectModel<typeof customer>;
