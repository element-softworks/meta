'use client';

import { DEFAULT_LOGIN_REDIRECT, adminRoute } from '@/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from './use-current-user';

export function useAdminRoute() {
	const user = useCurrentUser();
	const pathname = usePathname();
	const router = useRouter();

	const isAdminRoute = pathname.startsWith(adminRoute);

	//Admin protected routes
	if (isAdminRoute && !(user?.role === 'ADMIN')) {
		router.push(DEFAULT_LOGIN_REDIRECT);
	}

	return;
}
