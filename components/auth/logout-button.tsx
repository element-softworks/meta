'use client';

import { signOut } from 'next-auth/react';

interface LogoutButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}
export function LogoutButton(props: LogoutButtonProps) {
	const onClick = async () => {
		await signOut();
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{props.children}
		</span>
	);
}
