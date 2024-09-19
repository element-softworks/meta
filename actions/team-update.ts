'use server';

import { getIsUserTeamAdmin, getTeamById } from '@/data/team';
import { currentUser } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { TeamsSchema } from '@/schemas';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from './upload-file-to-s3';
import { db } from '@/db/drizzle/db';
import { TeamRole } from '@prisma/client';
import { eq } from 'drizzle-orm';
import { team } from '@/db/drizzle/schema';
export const teamUpdate = async (formData: FormData, teamId: string) => {
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

	const teamResponse = await getTeamById(teamId);

	if (!teamResponse) {
		return { error: 'Team not found' };
	}

	if (teamResponse.data?.currentMember?.role === TeamRole.USER) {
		return { error: 'You must be an admin to update the team' };
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

		let image = !!values.image.size ? `${s3Path}/${uuid}-${values.image.name}` : undefined;
		//Update the team
		const [updatedTeam] = await db
			.update(team)
			.set({
				name: values.name,
				image: !!values.image?.size ? `${s3Path}/${uuid}-${values.image.name}` : undefined,
			})
			.where(eq(team.id, teamId))
			.returning();

		console.log(updatedTeam, ' updated team');

		revalidatePath(`/dashboard/teams/${teamId}`);

		return { success: 'Team updated successfully', team: updatedTeam };
	} catch (e) {
		return { error: 'There was a problem uploading the file, please try again later' };
	}
};
