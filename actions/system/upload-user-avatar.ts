'use server';
import { currentUser } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { removeFileFromS3 } from './remove-file-from-s3';
import { uploadFileToS3 } from './upload-file-to-s3';
import { db } from '@/db/drizzle/db';
import { user } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { update } from '@/auth';

export const uploadUserAvatar = async (formData: FormData) => {
	const uuid = uuidv4();
	const userResponse = await currentUser();

	if (!userResponse) {
		return { error: 'User not found' };
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
	const avatar = formData.get('avatar') as File;

	if (!avatar) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}
	if (!avatar.size) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}

	if (avatar.size > 4000000) {
		return { error: 'File size cannot exceed 4MB. Please compress or upload another file.' };
	}

	try {
		const buffer = Buffer.from(await avatar.arrayBuffer());

		await uploadFileToS3(buffer, `${uuid}-${avatar.name}`);

		//Update the user's avatar
		try {
			if (userResponse.image && userResponse.image.includes(s3Path)) {
				//If the user already has an avatar, remove it from S3
				const avatarKey = userResponse.image.split('/').pop();
				await removeFileFromS3(avatarKey ?? '');
			}

			const [updatedUser] = await db
				.update(user)
				.set({
					image: `${s3Path}/${uuid}-${avatar.name}`,
				})
				.where(eq(user.id, userResponse.id!))
				.returning({ id: user.id });

			update({ user: { ...updatedUser } });
			revalidatePath(`/dashboard/admin/users/${updatedUser.id}`);
		} catch (e) {
			console.log(e, 'e.message');
			return { error: 'There was a problem uploading the file, please try again later' };
		}

		return { success: 'Avatar uploaded successfully' };
	} catch (e) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}
};
