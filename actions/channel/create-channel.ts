'use server';

import { db } from '@/db/drizzle/db';
import { channel } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { ChannelSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from '../system/upload-file-to-s3';

export const createChannel = async (formData: FormData) => {
	const authData = await checkPermissions({ admin: true });
	const uuid = uuidv4();

	if (authData?.error) {
		return authData;
	} else {
		const image = formData.get('image') as File;
		const name = formData.get('name') as string;
		const country = formData.get('country') as string;

		const values = {
			image,
			name,
			country,
		};

		const validatedFields = ChannelSchema.safeParse(values);

		console.log(image, 'image data');
		if (!validatedFields.success) {
			return { error: 'There was a problem creating channel, please try again later' };
		}

		if (
			!process.env.AWS_REGION ||
			!process.env.AWS_ACCESS_KEY_ID ||
			!process.env.AWS_SECRET_ACCESS_KEY ||
			!process.env.AWS_BUCKET_NAME ||
			s3Path.includes('undefined')
		) {
			return { error: 'AWS environment variables not set' };
		}

		if (image?.size > 4000000) {
			return {
				error: 'File size cannot exceed 4MB. Please compress or upload another file.',
			};
		}

		let imagePath = '';

		if (!!image?.size) {
			const buffer = Buffer.from(await image.arrayBuffer());

			await uploadFileToS3(buffer, `${uuid}-${image.name}`);
			imagePath = `${s3Path}/${uuid}-${image.name}`;
		}

		await db.insert(channel).values({
			name,
			image: imagePath ?? '',
			country,
			createdBy: authData?.user?.id ?? '',
		});

		revalidatePath('/dashboard/admin/channels');

		return { success: 'Channel created successfully.' };
	}
};
