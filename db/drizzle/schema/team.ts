import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { customer } from './customer';
import { teamMember } from './teamMember';
export const teamRole = pgEnum('TeamRole', ['OWNER', 'ADMIN', 'USER']);

export const team = pgTable(
	'Team',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		name: text('name').notNull(),
		createdBy: text('createdBy').notNull(),
		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }).notNull(),
		isArchived: boolean('isArchived').default(false).notNull(),
		image: text('image'),
		stripeCustomerId: text('stripeCustomerId'),
		stripePaymentId: text('stripePaymentId'),
	},
	(table) => {
		return {
			stripeCustomerIdStripePaymentIdIdx: index(
				'Team_stripeCustomerId_stripePaymentId_idx'
			).using(
				'btree',
				table.stripeCustomerId.asc().nullsLast(),
				table.stripePaymentId.asc().nullsLast()
			),
		};
	}
);

export const teamRelations = relations(team, ({ many }) => ({
	customers: many(customer),
	teamMembers: many(teamMember),
}));

export type Team = InferSelectModel<typeof team>;
