'use client';

import { newVerification } from '@/actions/new-verification';
import { useQuery } from '@/hooks/useQuery';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface NewVerificationFormProps {}
export function NewVerificationForm(props: NewVerificationFormProps) {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const hasFired = useRef(false);

	const { query: newVerificationQuery, status } = useQuery({
		queryFn: async () => await newVerification(token),
	});

	const onSubmit = useCallback(async () => {
		if (hasFired.current) return;
		hasFired.current = true;

		await newVerificationQuery();
	}, [token]);

	useEffect(() => {
		onSubmit();
	}, []);

	return (
		<Card className="min-w-96">
			<CardHeader>
				<CardTitle>Auth</CardTitle>
				<CardDescription>Confirming email verification</CardDescription>
			</CardHeader>
			<CardContent>
				{!status && <BeatLoader />}
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
			</CardContent>
			<CardFooter>
				<Link href="/auth/login">Back to login</Link>
			</CardFooter>
		</Card>
	);
}
