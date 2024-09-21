import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { doublePrecision, foreignKey, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customer } from './customer';
export const customerInvoice = pgTable(
	'CustomerInvoice',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		invoiceId: text('invoiceId'),
		customerId: text('customerId').notNull(),
		stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
		amountPaid: doublePrecision('amountPaid').notNull(),
		amountDue: doublePrecision('amountDue').notNull(),
		total: doublePrecision('total').notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		amountRemaining: doublePrecision('amountRemaining').notNull(),
		invoicePdf: text('invoicePdf'),
		currency: text('currency').notNull(),
		status: text('status').notNull(),
		teamId: text('teamId').notNull(),
		email: text('email').notNull(),
	},
	(table) => {
		return {
			customerIdIdx: index('CustomerInvoice_customerId_idx').using(
				'btree',
				table.customerId.asc().nullsLast()
			),
			customerInvoiceCustomerIdFkey: foreignKey({
				columns: [table.customerId],
				foreignColumns: [customer.id],
				name: 'CustomerInvoice_customerId_fkey',
			})
				.onUpdate('cascade')
				.onDelete('cascade'),
		};
	}
);

export const customerInvoiceRelations = relations(customerInvoice, ({ one }) => ({
	customer: one(customer, {
		fields: [customerInvoice.customerId],
		references: [customer.id],
	}),
}));

export type CustomerInvoice = InferSelectModel<typeof customerInvoice>;
