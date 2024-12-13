'use server';

import { db } from '@/db/drizzle/db';
import { fixtureType } from '@/db/drizzle/schema';
import { s3Path } from '@/lib/s3';
import { FixtureTypeSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from '../system/upload-file-to-s3';
import { checkPermissions } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { removeFileFromS3 } from '../system/remove-file-from-s3';

export const updateFixtureType = async (formData: FormData) => {
	const authData = await checkPermissions({ admin: true });

	const id = formData.get('id') as string;

	const [existingFixture] = await db.select().from(fixtureType).where(eq(fixtureType.id, id));

	if (!existingFixture) {
		return { error: 'Fixture type not found' };
	}

	if (authData?.error) {
		return authData;
	} else {
		let images = [];
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const category = {
			id: formData.get('category.id') as string,
			label: formData.get('category.label') as string,
		};
		// Iterate through the formData to log its contents
		for (let [key, value] of formData.entries()) {
			if (key.includes('images')) {
				images.push(value);
			}
		}

		const values = {
			images,
			name,
			category,
			description,
		};

		const validatedFields = FixtureTypeSchema.safeParse(values);

		console.log(validatedFields?.error?.message, 'validated fields');

		if (!validatedFields.success) {
			return { error: 'There was a problem creating fixture type, please try again later' };
		}

		//Upload image
		if (
			!process.env.AWS_REGION ||
			!process.env.AWS_ACCESS_KEY_ID ||
			!process.env.AWS_SECRET_ACCESS_KEY ||
			!process.env.AWS_BUCKET_NAME ||
			s3Path.includes('undefined')
		) {
			return { error: 'AWS environment variables not set' };
		}

		values.images.forEach((image, index) => {
			if (typeof image === 'string') return;

			if (!!image.size && image.size > 4000000) {
				return {
					error: 'File size cannot exceed 4MB. Please compress or upload another file.',
				};
			}
		});

		let uuids: { name: string; uuid: string }[] = [];

		await Promise.all(
			values.images.map(async (image, index) => {
				if (typeof image === 'string') return;
				const uuid = uuidv4();

				const buffer = Buffer.from(await image.arrayBuffer());
				await uploadFileToS3(buffer, `${uuid}-${image.name}`);

				uuids.push({ name: image.name, uuid });
			})
		);

		await Promise.all(
			existingFixture.images.map(async (image, index) => {
				await removeFileFromS3(image);
			})
		);

		await db
			.update(fixtureType)
			.set({
				name,
				description,
				category: category.id,
				images: values.images.map((image, index) => {
					if (typeof image === 'string') return image;
					const foundUuid = uuids.find((uuid) => uuid.name === image.name);
					return `${s3Path}/${foundUuid?.uuid}-${image.name}`;
				}),
				createdBy: authData?.user?.id ?? '',
			})
			.where(eq(fixtureType.id, id));

		revalidatePath('/dashboard/admin/fixture-types');

		return { success: 'Fixture type updated successfully.' };
	}
};
