'use server';

import { db } from '@/db/drizzle/db';
import {
	answer,
	fixtureTypeCategory,
	question,
	store,
	storeGeolocation,
} from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import fixtureTypeCategories from './fixture-type-categories.json';
import { FixtureTypeCategory } from '@/db/drizzle/schema/fixtureTypeCategory';

/**
 * Seed stores
 * @param {Object} options
 */

export const seedFixtureTypeCategories = async () => {
	// Parse stores and geolocations
	const authData = await checkPermissions({ admin: true });

	const parsedFixtureTypeCategories = fixtureTypeCategories.data.map((category: any) => ({
		id: category.id,
		archivedAt: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		archivedBy: null,
		createdBy: category.createdBy,
		name: category.name,
	}));

	if (authData?.error) {
		return authData;
	} else {
		try {
			await db.transaction(async (trx) => {
				await trx.delete(fixtureTypeCategory);

				// Insert question entries
				await trx.insert(fixtureTypeCategory).values(parsedFixtureTypeCategories);
			});

			return { success: 'Fixture type categories seeded successfully' };
		} catch (error: any) {
			console.error('error seeding fixture type categories', error);
			return { error: error.message };
		}
	}
};
