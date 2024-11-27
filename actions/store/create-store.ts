'use server';

import { db } from '@/db/drizzle/db';
import { Store, StoreInsert, store } from '@/db/drizzle/schema/store';
import { checkPermissions } from '@/lib/auth';
import { StoresSubmitSchema } from '@/schemas';
import { z } from 'zod';
import { uploadImage } from '../system/upload-image';
import { storeGeolocation } from '@/db/drizzle/schema';
import { revalidatePath } from 'next/cache';
import countries from '@/countries.json';

export const createStore = async (values: z.infer<typeof StoresSubmitSchema>) => {
	const authData = await checkPermissions({ admin: true });

	const validatedFields = await StoresSubmitSchema.safeParse(values);

	if (!validatedFields.success) {
		console.error('Error validating fields:', validatedFields.error);
		return { error: 'Error validating fields' };
	} else {
	}

	if (authData?.error) {
		return authData;
	} else {
		//Upload the location image

		const selectedCountry = countries.find(
			(country) =>
				country.code?.toLowerCase() === validatedFields?.data?.address?.country ||
				country.name?.toLowerCase() === validatedFields?.data?.address?.country
		);

		const imageResponse = await uploadImage(validatedFields?.data?.image?.[0]);
		const storeResponse: Store = await db.transaction(async (trx) => {
			const meta = {
				createdAt: new Date(),
				createdBy: authData?.user?.id ?? '',
				updatedAt: new Date(),
				updatedBy: authData?.user?.id ?? '',
			};

			// Insert into locations table
			const insertValues: StoreInsert = {
				name: validatedFields?.data?.name,
				maxCapacity: isNaN(validatedFields?.data?.maxCapacity!)
					? 0
					: validatedFields?.data?.maxCapacity ?? 0,
				coverImageAsset: validatedFields?.data?.image
					? imageResponse?.imagePath
					: undefined,
				contactEmail: validatedFields?.data?.contactEmail ?? '',
				contactPhone: validatedFields?.data?.contactPhone ?? '',
				openingTimes:
					validatedFields?.data?.openingTimes?.map((day) =>
						day?.map?.((time) => time?.map?.((startEnd) => Number(startEnd)))
					) ?? [],

				...meta,
			};

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
				country: selectedCountry?.code ?? validatedFields?.data.address.country,
				postCode: validatedFields?.data.address.postCode,
				...meta,
			});

			return newStore;
		});

		revalidatePath('/dashboard/stores');

		return { success: 'Store created successfully', store: storeResponse };
	}
};
