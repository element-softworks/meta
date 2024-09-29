'use server';

import { cookies } from 'next/headers';

export async function setCookie({
	name,
	value,
	maxAge,
}: {
	name: string;
	value: string;
	maxAge?: number;
}) {
	cookies().set(name, value, { maxAge: !!maxAge ? maxAge : undefined });
}

export async function getCookie(name: string) {
	return cookies().get(name);
}
