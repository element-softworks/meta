import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { fixtureTypeCategory } from './fixtureTypeCategory';

export const fixtureType = pgTable('FixtureType', {
	id: text('id')
		.primaryKey()
		.notNull()
		.default(sql`gen_random_uuid()`),
	createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdBy: text('createdBy').notNull(),
	archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
	archivedBy: text('archivedBy'),
	category: text('category')
		.notNull()
		.references(() => fixtureTypeCategory.id),
	images: text('images')
		.array()
		.default(sql`'{}'::text[]`)
		.notNull(),
	name: text('name').notNull(),
	description: text('description').notNull(),
});

export const fixtureTypeRelations = relations(fixtureType, ({ one, many }) => ({
	category: one(fixtureTypeCategory, {
		fields: [fixtureType.category],
		references: [fixtureTypeCategory.id],
	}),
}));

export type FixtureType = InferSelectModel<typeof fixtureType>;
