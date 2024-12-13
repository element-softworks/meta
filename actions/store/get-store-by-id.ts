'use server';

import { db } from '@/db/drizzle/db';
import { policy, store, storeGeolocation } from '@/db/drizzle/schema';
import { Policy } from '@/db/drizzle/schema/policy';
import { Store } from '@/db/drizzle/schema/store';
import { StoreGeolocation } from '@/db/drizzle/schema/storeGeolocation';
import { eq } from 'drizzle-orm';

export const getStoreById = async (id: string) => {
	const [storeResponse] = await db
		.select({
			store: { ...store, address: storeGeolocation },
			linkedPolicy: policy,
		})
		.from(store)
		.where(eq(store.id, id))
		.leftJoin(storeGeolocation, eq(store.id, storeGeolocation.storeId))
		.leftJoin(policy, eq(store.policyId, policy.id))
		.groupBy(store.id, storeGeolocation.id, policy.id);

	return storeResponse as StoreResponse;
};

export interface StoreResponse {
	linkedPolicy: Policy;
	store: Store & { address: StoreGeolocation };
}
