'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}
export function LoginButton(props: LoginButtonProps) {
	const router = useRouter();

	const onClick = () => {
		router.push('/auth/login');
	};
	return (
		<span onClick={onClick} className="cursor-pointer">
			{props.children}
		</span>
	);
}
