'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn } from 'next-auth/react';

interface SocialProps {
	className?: string;
}
export function Social(props: SocialProps) {
	const onClick = (provider: 'google' | 'github') => {
		signIn(provider, {
			redirectTo: DEFAULT_LOGIN_REDIRECT,
		});
	};

	return (
		<div className={`${props.className} flex flex-col w-full gap-y-2 items-center`}>
			<Button
				className="w-full"
				variant="outline"
				size="lg"
				onClick={() => onClick('google')}
			>
				<FcGoogle />
			</Button>

			<Button
				className="w-full"
				variant="outline"
				size="lg"
				onClick={() => onClick('github')}
			>
				<FaGithub />
			</Button>
		</div>
	);
}
