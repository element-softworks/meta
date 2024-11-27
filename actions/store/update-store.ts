'use server';

import { db } from '@/db/drizzle/db';
import { storeGeolocation } from '@/db/drizzle/schema';
import { Store, store } from '@/db/drizzle/schema/store';
import { checkPermissions } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { StoresSubmitSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { removeFileFromS3 } from '../system/remove-file-from-s3';
import { uploadImage } from '../system/upload-image';
import stores from './stores.json';

export const updateStore = async (values: z.infer<typeof StoresSubmitSchema>, storeId: string) => {
	const authData = await checkPermissions({ admin: true });

	const [foundStore] = await db.select().from(store).where(eq(store.id, storeId));
	if (!foundStore) {
		return { error: 'Store not found' };
	}

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

		let imageResponse = undefined;

		if (
			foundStore.coverImageAsset &&
			foundStore.coverImageAsset.includes(s3Path) &&
			!!validatedFields?.data?.image?.[0] &&
			typeof validatedFields?.data?.image?.[0] !== 'string'
		) {
			//If the user already has an asset, and there is a new image provided remove it from S3
			const avatarKey = foundStore.coverImageAsset.split('/').pop();

			//If the store is within the seed, do not remove the image from S3
			if (stores?.Store?.some?.((store) => store.id === storeId)) {
			} else {
				await removeFileFromS3(avatarKey ?? '');
			}

			imageResponse = await uploadImage(validatedFields?.data?.image?.[0]);
		} else {
		}

		const storeResponse: Store = await db.transaction(async (trx) => {
			const meta = {
				updatedAt: new Date(),
				updatedBy: authData?.user?.id ?? '',
			};

			// Insert into locations table
			const updateValues = {
				name: validatedFields?.data?.name,
				maxCapacity: isNaN(validatedFields?.data?.maxCapacity!)
					? 0
					: validatedFields?.data?.maxCapacity ?? 0,
				contactEmail: validatedFields?.data?.contactEmail ?? '',
				contactPhone: validatedFields?.data?.contactPhone ?? '',
				openingTimes:
					validatedFields?.data?.openingTimes?.map((day) =>
						day?.map?.((time) => time?.map?.((startEnd) => Number(startEnd)))
					) ?? [],

				...meta,
			};

			const [newStore] = await trx
				.update(store)
				.set({ ...updateValues, coverImageAsset: imageResponse?.imagePath ?? undefined })
				.where(eq(store.id, storeId))
				.returning();

			// Insert into locationGeolocations table
			await trx
				.update(storeGeolocation)
				.set({
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
				})
				.where(eq(storeGeolocation.storeId, storeId));

			return newStore;
		});

		revalidatePath('/dashboard/stores');

		return { success: 'Store updated successfully', store: storeResponse };
	}
};
