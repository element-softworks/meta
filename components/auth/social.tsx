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
				className="w-full bg-transparent"
				variant="outline"
				size="lg"
				onClick={() => onClick('google')}
			>
				<FcGoogle size={17} />
				<span className="ml-1 font-normal">Google</span>
			</Button>
		</div>
	);
}
