'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

if (!process.env.VERIFF_CLIENT_ID) {
	throw new Error('VERIFF_CLIENT_ID is not defined');
}

export const createVeriffSession = async () => {
	const session = await fetch('https://stationapi.veriff.com/v1/sessions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-AUTH-CLIENT': process.env.VERIFF_CLIENT_ID!,
		},
	}).then((res) => res.json());

	await cookies().set('veriffSession', session.verification.id);

	redirect(session.verification.url);
};
