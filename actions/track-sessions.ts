'use server';

import { getCookie, setCookie } from '@/data/cookies';
import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { addDays, addHours, addMinutes } from 'date-fns';
import { cookies, headers } from 'next/headers';
import { userAgent } from 'next/server';
import { UAParser } from 'ua-parser-js';

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
	console.log(agent?.device, 'agent device');
	const endsAtDate = addHours(new Date(), 1);

	const device = new UAParser(userAgent || '').getDevice();

	const [newSession] = await db
		.insert(session)
		.values({
			deviceType: agent?.device?.type ?? 'Unknown',
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
		maxAge: 60 * 60, // 1 hour
	});

	return;
};
