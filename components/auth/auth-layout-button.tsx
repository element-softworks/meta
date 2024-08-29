'use client';

import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';

export function AuthLayoutButton() {
	const location = usePathname();
	const isLogin = location === '/auth/login';
	const AuthButton = isLogin ? (
		<Button
			variant="ghost"
			className="top-4 md:top-8 left-4 md:left-8 absolute hidden md:block"
			asChild
		>
			<Link href={'/auth/register'}>Register</Link>
		</Button>
	) : (
		<Button
			variant="ghost"
			className="top-4 md:top-8 left-4 md:left-8 absolute hidden md:block"
			asChild
		>
			<Link href="/auth/login">Login</Link>
		</Button>
	);

	return AuthButton;
}
