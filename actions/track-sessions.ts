'use server';

import { getCookie, setCookie } from '@/data/cookies';
import { db } from '@/db/drizzle/db';
import { session } from '@/db/drizzle/schema';
import { addDays, addHours, addMinutes } from 'date-fns';
import { eq } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { userAgent } from 'next/server';

export const trackSessions = async (email: string, endSession?: boolean, action?: boolean) => {
	const sessionCookie = await getCookie('session');

	if (!!sessionCookie?.value && endSession) {
		await db
			.update(session)
			.set({
				endsAt: new Date(),
			})
			.where(eq(session.id, sessionCookie?.value));
		await cookies().set('session', '', {
			maxAge: 0,
		});
		return;
	}

	console.log(!!sessionCookie?.value, 'session cookie');

	if (!!sessionCookie) {
		console.log('session cookie exists');
		return { sessionCookie };
	} else {
		console.log('session cookie does not exist');
		const headersList = headers();
		const { get } = headers();

		const ipAddress =
			headersList.get('x-real-ip') ||
			headersList.get('x-forwarded-for') ||
			headersList.get('remote-addr');

		const userAgentStructure = { headers: headersList };
		const agent = userAgent(userAgentStructure);
		const endsAtDate = addHours(new Date(), 1);

		const viewport = agent?.device?.type === 'mobile' ? 'mobile' : 'desktop';

		const [newSession] = await db
			.insert(session)
			.values({
				deviceType: viewport,
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
			maxAge: 60 * 30, // 1 hour
		});

		return;
	}
};
