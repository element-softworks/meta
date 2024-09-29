'use client';

import { setCookie } from '@/data/cookies';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}
export function LogoutButton(props: LogoutButtonProps) {
	const router = useRouter();

	const onClick = async () => {
		await setCookie({ name: 'session', value: '', maxAge: 0 });
		signOut();
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{props.children}
		</span>
	);
}
