'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export const getSelfApplication = async () => {
	const applicationId = await cookies().get('coachApplicationId');

	try {
		const [foundCoachApplication] = await db
			.select()
			.from(coachApplication)
			.where(eq(coachApplication.id, applicationId?.value ?? ''));

		if (!foundCoachApplication || foundCoachApplication?.status !== 'IN_PROGRESS') {
			return {
				data: null,
			};
		}

		return {
			success: 'Coach application found',
			data: foundCoachApplication ?? applicationId?.value,
		};
	} catch (error) {
		console.error(error, 'Error getting coach application');
		return {
			error: 'Error getting coach application',
		};
	}
};
