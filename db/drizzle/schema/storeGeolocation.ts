import {
	integer,
	doublePrecision,
	varchar,
	jsonb,
	index,
	text,
	pgTable,
	timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { store } from './store';

export const storeGeolocation = pgTable(
	'StoreGeolocation',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		storeId: text('store_id').references(() => store.id),
		longitude: doublePrecision('longitude').notNull(),
		latitude: doublePrecision('latitude').notNull(),
		zoom: integer('zoom').notNull(),
		boundingBox: jsonb('bounding_box').notNull(),
		addressName: varchar('address_name', { length: 256 }).notNull(),
		addressLineOne: varchar('address_line_one', { length: 256 }),
		addressLineTwo: varchar('address_line_two', { length: 256 }),
		city: varchar('city', { length: 256 }),
		county: varchar('county', { length: 256 }),
		country: varchar('country', { length: 256 }),
		postCode: varchar('post_code', { length: 32 }),
		addressType: varchar('address_type', { length: 50 }).notNull(),

		createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdBy: text('createdBy').notNull(),
		updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedBy: text('updatedBy').notNull(),
		archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
		archivedBy: text('archivedBy'),
	},
	(storeGeolocation) => ({
		storeIdIndex: index('store_geolocation_store_id_index').on(storeGeolocation.storeId),
	})
);

export const storeGeolocationRelations = relations(storeGeolocation, ({ one }) => ({
	store: one(store, {
		fields: [storeGeolocation.storeId],
		references: [store.id],
	}),
}));

export type StoreGeolocation = typeof storeGeolocation.$inferSelect;
export type StoreGeolocationInsert = typeof storeGeolocation.$inferInsert;
