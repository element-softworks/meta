'use server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { s3Path } from '@/lib/s3';
import { removeFileFromS3 } from './remove-file-from-s3';
import { uploadFileToS3 } from './upload-file-to-s3';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { update } from '@/auth';

export const uploadUserAvatar = async (file: any) => {
	const uuid = uuidv4();
	const user = await currentUser();

	if (!user) {
		return { error: 'User not found' };
	}

	//If the user already has an avatar, remove it from S3
	if (user.image && user.image.includes(s3Path)) {
		const avatarKey = user.image.split('/').pop();
		await removeFileFromS3(avatarKey ?? '');
	}

	try {
		const avatar = file.get('avatar');

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
