'use server';

import { db } from '@/db/drizzle/db';
import { coachApplication } from '@/db/drizzle/schema';
import { headers } from 'next/headers';

export const coachApplicationStart = async () => {
	const headersList = headers();
	const header_url = headersList.get('x-url') || '';

	if (header_url.includes('/auth/coach-setup?step=thank-you')) return;

	const [newCoachApplication] = await db
		.insert(coachApplication)
		.values({ status: 'IN_PROGRESS' })
		.returning({ id: coachApplication.id });

	return { success: true, data: newCoachApplication };
};
