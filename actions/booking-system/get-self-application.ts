'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const getSelfApplication = async () => {
	const applicationId = await cookies().get('coachApplicationId');

	console.log(applicationId, 'inner app id');
	try {
		const [foundCoachApplication] = await db
			.select()
			.from(coachApplication)
			.where(eq(coachApplication.id, applicationId?.value ?? ''));

		if (!foundCoachApplication) {
			return {
				data: null,
			};
		}

		return { success: 'Coach application found', data: foundCoachApplication };
	} catch (error) {
		console.error(error, 'Error getting coach application');
		return {
			error: 'Error getting coach application',
		};
	}
};
