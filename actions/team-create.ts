'use server';

import { db } from '@/lib/db';
import { s3Path } from '@/lib/s3';
import { TeamsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { currentUser } from '@/lib/auth';
import { uploadFileToS3 } from './upload-file-to-s3';
import { revalidatePath } from 'next/cache';
export const teamCreate = async (formData: FormData) => {
	const uuid = uuidv4();
	const user = await currentUser();

	const image = formData.get('image') as File;
	const name = formData.get('name') as string;

	const values = {
		image: image,
		name: name,
	};
	const validatedFields = TeamsSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'There was a problem registering, please try again later' };
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

	if (!!values.image.size && values.image.size > 4000000) {
		return { error: 'File size cannot exceed 4MB. Please compress or upload another file.' };
	}

	try {
		if (!!values.image.size) {
			//Upload the image to S3 if its provided
			const buffer = Buffer.from(await values.image.arrayBuffer());
			await uploadFileToS3(buffer, `${uuid}-${values.image.name}`);
		}
		//Create the team
		const newTeam = await db.team.create({
			data: {
				name: values.name,
				createdBy: user?.email ?? '',
				image: !!values.image ? `${s3Path}/${uuid}-${values.image.name}` : undefined,
			},
		});

		//Create new team member
		const newTeamMember = await db.teamMember.create({
			data: {
				role: UserRole.ADMIN,
				teamId: newTeam.id,
				userId: user?.id ?? '',
			},
		});

		revalidatePath(`/dashboard/teams`);

		return { success: 'Team created sucessfully', team: newTeam };
	} catch (e) {
		console.log(e, 'e.message');
		return { error: 'There was a problem uploading the file, please try again later' };
	}
};
