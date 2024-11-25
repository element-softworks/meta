'use server';

import { db } from '@/db/drizzle/db';
import { Store, StoreInsert, store } from '@/db/drizzle/schema/store';
import { checkPermissions } from '@/lib/auth';
import { StoresSchema } from '@/schemas';
import { z } from 'zod';
import { uploadImage } from '../system/upload-image';
import { storeGeolocation } from '@/db/drizzle/schema';

export const createStore = async (values: z.infer<typeof StoresSchema>) => {
	console.log(values, 'recieved values');
	const authData = await checkPermissions({ admin: true });

	const validatedFields = await StoresSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: validatedFields.error.errors };
	}

	if (authData?.error) {
		return authData;
	} else {
		//Upload the location image

		const imageResponse = await uploadImage(validatedFields?.data?.image);

		const storeResponse: Store = await db.transaction(async (trx) => {
			const meta = {
				createdAt: new Date(),
				createdBy: authData?.user?.id ?? '',
				updatedAt: new Date(),
				updatedBy: authData?.user?.id ?? '',
			};

			console.log('creating 1...');

			// Insert into locations table
			const insertValues: StoreInsert = {
				name: validatedFields?.data?.name,
				maxCapacity: validatedFields?.data?.maxCapacity ?? 0,
				coverImageAsset: validatedFields?.data?.image
					? imageResponse?.imagePath
					: undefined,
				contactEmail: validatedFields?.data?.contactEmail ?? '',
				contactPhone: validatedFields?.data?.contactPhone ?? '',
				openingTimes: validatedFields?.data?.openingTimes ?? [],
				...meta,
			};
			console.log('creating 2...');

			const [newStore] = await trx.insert(store).values(insertValues).returning();

			// Insert into locationGeolocations table
			await trx.insert(storeGeolocation).values({
				storeId: newStore.id,
				longitude: validatedFields?.data.longitude,
				latitude: validatedFields?.data.latitude,
				zoom: validatedFields?.data.zoom,
				boundingBox: JSON.stringify(validatedFields?.data.boundingBox),
				addressType: validatedFields?.data?.address?.addressType ?? '',
				addressName: validatedFields?.data.address.name,
				addressLineOne: validatedFields?.data.address.lineOne,
				addressLineTwo: validatedFields?.data.address.lineTwo,
				city: validatedFields?.data.address.city,
				county: validatedFields?.data.address.county,
				country: validatedFields?.data.address.country,
				postCode: validatedFields?.data.address.postCode,
				...meta,
			});
			console.log('creating 3...');

			return newStore;
		});

		return { success: 'Store created successfully', store: storeResponse };
	}
};
