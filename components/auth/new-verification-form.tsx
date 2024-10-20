'use client';

import { newEmailVerification } from '@/actions/account/new-email-verification';
import { useMutation } from '@/hooks/use-mutation';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { Button } from '../ui/button';
import { Social } from './social';

interface NewVerificationFormProps {}
export function NewVerificationForm(props: NewVerificationFormProps) {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const hasFired = useRef(false);

	const { query: newVerificationQuery, status } = useMutation({
		queryFn: async () => await newEmailVerification(token),
	});

	const onSubmit = useCallback(async () => {
		if (hasFired.current) return;
		hasFired.current = true;

		await newVerificationQuery();
	}, [newVerificationQuery]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<div className="flex flex-col gap-4 max-w-full md:w-[400px]">
			<div className="mb-4 ">
				<h1 className="text-2xl font-semibold tracking-tight">Verifying email</h1>
				<p className="text-sm text-muted-foreground">Email verification is in progress</p>
			</div>

			{!status && (
				<div className="flex items-center space-x-2">
					<BeatLoader size={8} />
					<span>Email verifying</span>
				</div>
			)}
			{status === 'success' && (
				<div className="flex items-center space-x-2">
					<Check />
					<span>Email verified!</span>
				</div>
			)}
			{status === 'error' && (
				<div className="flex items-center space-x-2">
					<FaExclamation />
					<span>Failed to verify email</span>
				</div>
			)}

			<Link href="/auth/login">
				<Button isLoading={false} className="w-full mt-2">
					Back to login
				</Button>
			</Link>

			<div className="relative mt-2">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t"></span>
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Social className="mt-2" />

			<p className="px-8 text-center text-sm text-muted-foreground">
				Already have an account?{' '}
				<Button asChild variant="link" className="px-0 text-muted-foreground">
					<Link href="/auth/login">Login now</Link>
				</Button>
			</p>
		</div>
	);
}
