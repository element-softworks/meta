'use client';

import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}
export function LogoutButton(props: LogoutButtonProps) {
	const router = useRouter();
	const onClick = async () => {
		router.push('/auth/logout');
	};

	return (
		<span onClick={onClick} className="cursor-pointer">
			{props.children}
		</span>
	);
}
