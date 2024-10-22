'use client';
import { CenteredLoader } from '@/components/layout/centered-loader';
import { setCookie } from '@/data/cookies';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function LogoutPage() {
	useEffect(() => {
		(async () => {
			await setCookie({ name: 'session', value: '', maxAge: 0 });
			await signOut({ redirect: true });
		})();
	}, []);

	return <CenteredLoader />;
}
