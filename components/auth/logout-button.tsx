'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}
export function LogoutButton(props: LogoutButtonProps) {
	const router = useRouter();

	const onClick = () => {
		signOut();
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{props.children}
		</span>
	);
}
