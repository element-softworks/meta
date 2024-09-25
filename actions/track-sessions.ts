'use server';

import { getCookie, setCookie } from '@/data/cookies';
import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { addDays, addHours } from 'date-fns';
import { cookies, headers } from 'next/headers';
import { userAgent } from 'next/server';

export const trackSessions = async (email: string) => {
	const sessionCookie = await getCookie('session');

	if (sessionCookie) {
		return { sessionCookie };
	}

	const headersList = headers();

	const ipAddress =
		headersList.get('x-real-ip') ||
		headersList.get('x-forwarded-for') ||
		headersList.get('remote-addr');

	const userAgentStructure = { headers: headersList };
	const agent = userAgent(userAgentStructure);

	const endsAtDate = addHours(new Date(), 1);
	const [newSession] = await db
		.insert(session)
		.values({
			createdAt: new Date(),
			email: email,
			browser: agent?.browser?.name ?? 'Unknown',
			engine: agent?.engine?.name ?? 'Unknown',
			os: agent?.os?.name ?? 'Unknown',
			device: agent?.device?.model ?? 'Unknown',
			cpu: agent?.cpu?.architecture ?? 'Unknown',
			ipAddress: ipAddress ?? 'Unknown',
			userAgent: agent?.ua,
			isBot: agent?.isBot,
			endsAt: endsAtDate,
		})
		.returning({ id: session.id });

	await cookies().set('session', newSession.id, {
		expires: endsAtDate,
	});

	return;
};
