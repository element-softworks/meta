'use server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

if (!process.env.VERIFF_CLIENT_ID) {
	throw new Error('VERIFF_CLIENT_ID is not defined');
}

/**
 * Generates an HMAC signature using the Veriff secret and payload.
 * @param {string} sharedSecretKey - The Veriff secret.
 * @param {string} payload - The payload to sign (e.g., request data or URL).
 * @returns {string} - The HMAC signature in hexadecimal format.
 */
function generateHmacSignature(sharedSecretKey: string, payload: string): string {
	return crypto.createHmac('sha256', sharedSecretKey).update(payload, 'utf8').digest('hex');
}

export const getVeriffDecision = async () => {
	const veriffSession = await cookies().get('veriffSession');

	const hmacSignature = generateHmacSignature(
		process.env.VERIFF_SECRET!,
		veriffSession?.value ?? ''
	);

	const session = await fetch(
		`https://stationapi.veriff.com/v1/sessions/${veriffSession?.value}/attempts`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-AUTH-CLIENT': process.env.VERIFF_CLIENT_ID!,
				'X-HMAC-SIGNATURE': hmacSignature,
			},
		}
	).then((res) => res.json());

	console.log(session, 'session response');
	const verified = session?.verifications?.some((v: any) => v?.status === 'approved') ?? false;

	if (session?.verifications?.[0]?.status === 'created') {
		redirect('/auth/coach-setup?step=identity-check');
	}

	if (verified) {
		return { success: 'Verification successful', verified: true };
	} else {
		return { error: 'Verification failed', verified: false };
	}
};
