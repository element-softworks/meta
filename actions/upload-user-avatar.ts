'use server';
import { update } from '@/auth';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { s3Path } from '@/lib/s3';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { removeFileFromS3 } from './remove-file-from-s3';
import { uploadFileToS3 } from './upload-file-to-s3';

export const uploadUserAvatar = async (formData: FormData) => {
	const uuid = uuidv4();
	const user = await currentUser();

	if (!user) {
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

	if (user.image && user.image.includes(s3Path)) {
		//If the user already has an avatar, remove it from S3
		const avatarKey = user.image.split('/').pop();
		await removeFileFromS3(avatarKey ?? '');
	}

	try {
		const avatar = formData.get('avatar') as File;

		if (!avatar) {
			return { error: 'There was a problem uploading the file, please try again later' };
		}
		if (!avatar.size) {
			return { error: 'There was a problem uploading the file, please try again later' };
		}

		const buffer = Buffer.from(await avatar.arrayBuffer());

		await uploadFileToS3(buffer, `${uuid}-${avatar.name}`);

		//Update the user's avatar
		try {
			const updatedUser = await db.user.update({
				where: { id: user.id },
				data: {
					image: `${s3Path}/${uuid}-${avatar.name}`,
				},
			});

			update({ user: { ...updatedUser } });
			revalidatePath(`/dashboard/admin/users/${updatedUser.id}`);
		} catch (e) {
			console.log(e, 'e.message');
			return { error: 'There was a problem uploading the file, please try again later' };
		}

		return { success: 'Avatar uploaded successfully' };
	} catch (e) {
		console.log(e, 'e.message');
		return { error: 'There was a problem uploading the file, please try again later' };
	}
};
