'use server';
import { s3Client } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadFileToS3(buffer: Buffer, key: string) {
	try {
		await s3Client.send(
			new PutObjectCommand({
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: key,
				Body: buffer,
			})
		);
	} catch (error) {
		console.error(error);
	}
}
