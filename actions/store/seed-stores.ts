'use server';

import { db } from '@/db/drizzle/db';
import { store, storeGeolocation } from '@/db/drizzle/schema';
import geolocations from './store-geolocations.json';
import stores from './stores.json';

/**
 * Seed stores
 * @param {Object} options
 */

export const seedStores = async () => {
	// Parse stores and geolocations
	const parsedStores = stores.Store.map((store: any) => ({
		...store,
		// Parse openingTimes JSON string into an array
		openingTimes: JSON.parse(store.openingTimes),
		createdAt: new Date(),
		updatedAt: new Date(),
	}));

	const parsedGeolocations = geolocations.StoreGeolocation.map((geo: any) => ({
		...geo,
		createdAt: new Date(),
		updatedAt: new Date(),
	}));

	try {
		await db.transaction(async (trx) => {
			await trx.delete(storeGeolocation);
			await trx.delete(store);
			//Insert store entries
			await trx.insert(store).values(parsedStores);

			//Insert store geolocations
			await trx.insert(storeGeolocation).values(parsedGeolocations);
		});

		return { success: 'Stores seeded successfully' };
	} catch (error: any) {
		console.error('error seeding stores', error);
		return { error: error.message };
	}
};
