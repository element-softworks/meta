'use server';

import { db } from '@/db/drizzle/db';
import { store, storeGeolocation } from '@/db/drizzle/schema';
import { Store } from '@/db/drizzle/schema/store';
import { StoreGeolocation } from '@/db/drizzle/schema/storeGeolocation';
import { eq } from 'drizzle-orm';

export const getStoreById = async (id: string) => {
	const [storeResponse] = await db
		.select({
			store: { ...store, address: storeGeolocation },
		})
		.from(store)
		.where(eq(store.id, id))
		.leftJoin(storeGeolocation, eq(store.id, storeGeolocation.storeId))
		.groupBy(store.id, storeGeolocation.id);

	return storeResponse as StoreResponse;
};

export interface StoreResponse {
	store: Store & { address: StoreGeolocation };
}
