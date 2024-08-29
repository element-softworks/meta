'use client';

import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

//Prefer to get the user on the server side with auth.ts / await currentUser() as this guarantees the user will be available within NextAuth
export function useCurrentUser() {
	const session = useSession()?.data?.user;

	return session;
}
