import { s3Client } from '@/lib/s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

export async function removeFileFromS3(key: string) {
	try {
		await s3Client.send(
			new DeleteObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
			})
		);
	} catch (error) {
		console.error(error);
	}
}
