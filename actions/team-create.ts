'use server';

import { currentUser } from '@/lib/auth';
import { s3Path } from '@/lib/s3';
import { TeamsSchema } from '@/schemas';
import { TeamRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToS3 } from './upload-file-to-s3';
import { setCookie } from '@/data/cookies';
import { db } from '@/db/drizzle/db';
import { team, teamMember } from '@/db/drizzle/schema';
export const teamCreate = async (formData: FormData) => {
	const uuid = uuidv4();
	const user = await currentUser();

	if (!user) {
		return { error: 'You must be logged in to create a team' };
	}

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

	if (!!values.image.size) {
		//Upload the image to S3 if its provided
		const buffer = Buffer.from(await values.image.arrayBuffer());
		await uploadFileToS3(buffer, `${uuid}-${values.image.name}`);
	}
	//Create the team
	const [newTeam] = await db
		.insert(team)
		.values({
			name: values.name,
			createdBy: user?.email ?? '',
			image: !!values.image?.size ? `${s3Path}/${uuid}-${values.image.name}` : undefined,
			updatedAt: new Date(),
		})
		.returning({ id: team.id });

	if (!newTeam) {
		return { error: 'There was a problem creating the team, please try again later' };
	}

	//Create new team member
	await db.insert(teamMember).values({
		role: TeamRole.OWNER,
		teamId: newTeam.id,
		userId: user?.id ?? '',
		updatedAt: new Date(),
	});

	//Set the current team cookie to the new team
	setCookie({
		name: `${user?.email}-current-team`,
		value: newTeam.id,
	});

	revalidatePath(`/dashboard/teams`);

	return { success: 'Team created successfully', team: newTeam };
};
