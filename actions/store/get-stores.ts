'use server';

import { db } from '@/db/drizzle/db';
import { policy, store, storeGeolocation } from '@/db/drizzle/schema';
import { Store } from '@/db/drizzle/schema/store';
import { StoreGeolocation } from '@/db/drizzle/schema/storeGeolocation';
import { checkPermissions } from '@/lib/auth';
import { and, count, desc, eq, exists, isNull, ne, not, sql } from 'drizzle-orm';

export const getStores = async (
	perPage: number,
	pageNum: number,
	search?: string,
	showArchived?: boolean,
	hideStoresWithPolicies?: boolean
) => {
	const authResponse = await checkPermissions({ admin: false });

	if (authResponse?.error) {
		return authResponse;
	} else {
		try {
			const foundStores = await db
				.select({
					store: {
						...store,
						geolocation: storeGeolocation,
					},
				})
				.from(store)
				.where(
					and(
						!showArchived
							? isNull(store.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(store.archivedAt))
							: isNull(store.archivedAt),
						!!search?.length
							? sql`lower(${store.name}) like ${`%${search.toLowerCase()}%`}`
							: undefined,
						hideStoresWithPolicies ? and(isNull(store.policyId)) : undefined
					)
				)
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(store.createdAt))
				.leftJoin(storeGeolocation, eq(store.id, storeGeolocation.storeId));

			const [totalStores] = await db
				.select({ count: count() })
				.from(store)
				.where(
					and(
						!showArchived
							? isNull(store.archivedAt)
							: authResponse?.user?.role === 'ADMIN'
							? not(isNull(store.archivedAt))
							: isNull(store.archivedAt),
						!!search?.length
							? sql`lower(${store.name}) like ${`%${search.toLowerCase()}%`}`
							: undefined
					)
				);

			const totalPages = Math.ceil(totalStores.count / Number(perPage));

			return {
				success: true,
				stores: foundStores,
				totalPages: totalPages,
				total: totalStores.count,
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'An error occurred retrieving the stores, please try again later.',
			};
		}
	}
};

export interface StoreResponse {
	success: boolean;
	stores: { store: Store & { geolocation: StoreGeolocation } }[];
	totalPages: number;
	total: number;
}
