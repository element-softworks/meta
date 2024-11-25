'use server';

import { db } from '@/db/drizzle/db';
import { store, storeGeolocation } from '@/db/drizzle/schema';
import { Store } from '@/db/drizzle/schema/store';
import { StoreGeolocation } from '@/db/drizzle/schema/storeGeolocation';
import { checkPermissions } from '@/lib/auth';
import { count, desc, eq, sql } from 'drizzle-orm';

export const getStores = async (perPage: number, pageNum: number, search?: string) => {
	const authResponse = await checkPermissions({ admin: true });

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
					!!search?.length
						? sql`lower(${store.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				)
				.limit(Number(perPage))
				.offset((Number(pageNum) - 1) * Number(perPage))
				.orderBy(desc(store.createdAt))
				.leftJoin(storeGeolocation, eq(store.id, storeGeolocation.storeId));

			const [totalStores] = await db
				.select({ count: count() })
				.from(store)
				.where(
					!!search?.length
						? sql`lower(${store.name}) like ${`%${search.toLowerCase()}%`}`
						: undefined
				);

			const totalPages = Math.ceil(totalStores.count / Number(perPage));

			console.log(foundStores, 'foundStores');

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
