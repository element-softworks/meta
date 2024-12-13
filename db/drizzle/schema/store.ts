import { relations, sql } from 'drizzle-orm';
import {
	doublePrecision,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';
import { storeGeolocation } from './storeGeolocation';
import { policy } from './policy';
import { storeQuestion } from './storeQuestion';

export const store = pgTable(
	'Store',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.default(sql`gen_random_uuid()`),
		name: varchar('name', { length: 256 }).notNull(),
		policyId: text('policyId').references(() => policy.id, { onDelete: 'cascade' }),
		compliancePercentage: doublePrecision('compliance_percentage'),
		complianceAcceptancePercentage: doublePrecision('compliance_acceptance_percentage'),
		contactPhone: text('contact_phone'),
		maxCapacity: integer('max_capacity'),
		coverImageAsset: text('cover_image_asset'),
		contactEmail: varchar('contact_email', { length: 256 }),
		openingTimes: jsonb('opening_times').$type<number[][][]>(),
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
	(store) => ({
		nameTextIndex: index('store_name_index').on(store.name),
	})
);

export const storeRelations = relations(store, ({ one, many }) => ({
	geolocation: one(storeGeolocation, {
		fields: [store.id],
		references: [storeGeolocation.storeId],
	}),
	policy: one(policy, {
		fields: [store.policyId],
		references: [policy.id],
	}),
	// storeQuestions: many(storeQuestion),
}));

export type Store = typeof store.$inferSelect;
export type StoreInsert = typeof store.$inferInsert;

export interface IStoreResponse {
	id: number;
	name: string;
	maxCapacity: number | null;
	geolocation: {
		longitude: number;
		latitude: number;
		zoom: number;
		boundingBox: number[][];
		address: {
			name: string;
			lineOne?: string;
			lineTwo?: string;
			city?: string;
			county?: string;
			country?: string;
			postCode?: string;
			type: string;
		};
	};
	details: {
		contact: {
			phone: {
				diallingCode: string;
				number: string;
				primary: boolean;
			}[];
			email?: string;
		};
		openingTimes: number[][][];
	};
	coverImageAsset: {
		id: number;
		documentType: string;
		name: string;
		fileName: string;
		fileExtension: string;
		type: string;
		size: number;
		internal: boolean;
		sizes: {
			id: number;
			type: string;
			url: string;
			key: string;
			size: number;
			assetId: number;
		}[];
	} | null;
	assets: {
		id: number;
		documentType: string;
		name: string;
		fileName: string;
		fileExtension: string;
		type: string;
		size: number;
		internal: boolean;
		sizes: {
			id: number;
			type: string;
			url: string;
			key: string;
			size: number;
			assetId: number;
		}[];
	}[];
	createdAt: Date;
	createdBy: string;
	updatedAt: Date;
	updatedBy: string;
	organisation: string;
	archivedAt?: Date;
}
