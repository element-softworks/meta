'use client';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '../ui/button';

interface SocialProps {
	className?: string;
	disabled?: boolean;
}
export function Social(props: SocialProps) {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get('callbackUrl');

	const onClick = (provider: 'google') => {
		signIn(provider, {
			callbackUrl: callbackUrl || '/dashboard',
		});
	};

	if (props.disabled) return null;

	return (
		<div className={`${props.className} flex flex-col w-fit gap-y-2 items-center`}>
			<Button
				className="flex items-center w-full bg-white border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-all"
				variant="outline"
				size="lg"
				aria-label="Sign in with Google"
				onClick={() => onClick('google')}
			>
				<FcGoogle size={20} className="mr-2" />
				<span className="text-sm font-medium text-gray-800">Continue with Google</span>
			</Button>
		</div>
	);
}
