import { relations, sql } from 'drizzle-orm';
import {
	boolean,
	foreignKey,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { team } from './team';
import { customerInvoice } from './customerInvoice';

export const customer = pgTable(
	'Customer',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		teamId: text('teamId').notNull(),
		userId: text('userId').notNull(),
		stripeCustomerId: text('stripeCustomerId').notNull(),
		stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
		startDate: timestamp('startDate', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		endDate: timestamp('endDate', { precision: 3, mode: 'date' }).notNull(),
		planId: text('planId').notNull(),
		email: text('email').notNull(),
		status: text('status').notNull(),
		cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull(),
	},
	(table) => {
		return {
			stripeCustomerIdKey: uniqueIndex('Customer_stripeCustomerId_key').using(
				'btree',
				table.stripeCustomerId.asc().nullsLast()
			),
			teamIdUserIdIdx: index('Customer_teamId_userId_idx').using(
				'btree',
				table.teamId.asc().nullsLast(),
				table.userId.asc().nullsLast()
			),
			customerTeamIdFkey: foreignKey({
				columns: [table.teamId],
				foreignColumns: [team.id],
				name: 'Customer_teamId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const customerRelations = relations(customer, ({ one, many }) => ({
	team: one(team, {
		fields: [customer.teamId],
		references: [team.id],
	}),
	customerInvoices: many(customerInvoice),
}));
