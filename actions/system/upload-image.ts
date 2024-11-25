'use server';
import { s3Path } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from './upload-file-to-s3';

export const uploadImage = async (image: File) => {
	const uuid = uuidv4();

	if (
		!process.env.AWS_REGION ||
		!process.env.AWS_ACCESS_KEY_ID ||
		!process.env.AWS_SECRET_ACCESS_KEY ||
		!process.env.AWS_BUCKET_NAME ||
		s3Path.includes('undefined')
	) {
		return { error: 'AWS environment variables not set' };
	}

	if (!image) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}
	if (!image.size) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}

	if (image.size > 4000000) {
		return { error: 'File size cannot exceed 4MB. Please compress or upload another file.' };
	}

	try {
		const buffer = Buffer.from(await image.arrayBuffer());

		await uploadFileToS3(buffer, `${uuid}-${image.name}`);

		return {
			success: 'Image uploaded successfully',
			imagePath: `${s3Path}/${uuid}-${image.name}`,
		};
	} catch (e) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}
};
