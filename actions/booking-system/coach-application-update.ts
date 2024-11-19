'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { CoachSetupSchema } from '@/schemas';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import * as z from 'zod';
import { uploadFileToS3 } from '../system/upload-file-to-s3';
import { v4 as uuidv4 } from 'uuid';
import { s3Path } from '@/lib/s3';
import { removeFileFromS3 } from '../system/remove-file-from-s3';

export const coachApplicationUpdate = async (
	values: Partial<z.infer<typeof CoachSetupSchema>>,
	formData?: FormData
) => {
	const uuid = uuidv4();

	const applicationId = await cookies().get('coachApplicationId');

	if (!applicationId?.value?.length) {
		return { error: 'An error occurred while retrieving the coach application id' };
	}

	const [foundApplication] = await db
		.select()
		.from(coachApplication)
		.where(eq(coachApplication.id, applicationId.value));

	if (!foundApplication) {
		return { error: 'An error occurred while retrieving the coach application' };
	}

	const avatar = formData?.get('avatar') as File;

	if (avatar?.size > 3000000) {
		return { error: 'File size cannot exceed 3MB. Please compress or upload another file.' };
	}

	if (!!avatar?.size) {
		const buffer = Buffer.from(await avatar.arrayBuffer());

		await uploadFileToS3(buffer, `${uuid}-${avatar.name}`);
	}

	if (!!foundApplication.avatar && foundApplication?.avatar?.includes(s3Path)) {
		//If the user already has an avatar, remove it from S3
		const avatarKey = foundApplication.avatar.split('/').pop();
		await removeFileFromS3(avatarKey ?? '');
	}

	await db
		.update(coachApplication)
		.set({
			email: !!values?.email ? values.email : undefined,
			firstName: !!values?.firstName ? values.firstName : undefined,
			lastName: !!values?.lastName ? values.lastName : undefined,
			password: !!values?.password ? values.password : undefined,
			agreedToMarketing: !!values?.agreedToMarketing ? values.agreedToMarketing : undefined,
			agreedToTerms: !!values?.agreedToTerms ? values.agreedToTerms : undefined,
			businessName: values.businessName,
			businessNumber: !!values?.businessNumber ? values.businessNumber : undefined,
			location: !!values?.location ? values.location : undefined,
			timezone: !!values?.timezone ? values.timezone : undefined,
			yearsExperience: !!values?.yearsExperience ? Number(values.yearsExperience) : undefined,
			avatar: !!avatar?.size ? `${s3Path}/${uuid}-${avatar.name}` : undefined,
		})
		.where(eq(coachApplication.id, applicationId.value));

	return { success: true };
};
