'use server';

import { db } from '@/db/drizzle/db';
import { channel } from '@/db/drizzle/schema';
import { checkPermissions } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { ChannelSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from '../system/upload-file-to-s3';
import { eq } from 'drizzle-orm';
import { removeFileFromS3 } from '../system/remove-file-from-s3';

export const updateChannel = async (formData: FormData) => {
	const authData = await checkPermissions({ admin: true });
	const uuid = uuidv4();

	if (authData?.error) {
		return authData;
	} else {
		const image = formData.get('image') as File;
		const name = formData.get('name') as string;
		const country = formData.get('country') as string;
		const channelId = formData.get('id') as string;

		console.log(image, 'values image');
		const values = {
			image,
			name,
			country,
		};

		const validatedFields = ChannelSchema.safeParse(values);

		if (!validatedFields.success) {
			return { error: 'There was a problem updating channel, please try again later' };
		}

		const [existingChannel] = await db.select().from(channel).where(eq(channel.id, channelId));

		if (!existingChannel) {
			return { error: 'Channel not found' };
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

		let imagePath = typeof values.image === 'string' ? values.image : '';

		if (!!image?.size) {
			const buffer = Buffer.from(await image.arrayBuffer());

			await uploadFileToS3(buffer, `${uuid}-${image.name}`);
			imagePath = `${s3Path}/${uuid}-${image.name}`;

			if (existingChannel.image && existingChannel.image.includes(s3Path)) {
				//If the user already has an avatar, remove it from S3
				const imageKey = existingChannel.image.split('/').pop();
				await removeFileFromS3(imageKey ?? '');
			}
		}

		console.log(imagePath, 'image data');

		await db
			.update(channel)
			.set({
				name,
				image: imagePath,
				country,
				updatedAt: new Date(),
				updatedBy: authData?.user?.id ?? '',
			})
			.where(eq(channel.id, channelId));

		revalidatePath('/dashboard/admin/channels');

		return { success: 'Channel updated successfully.' };
	}
};
