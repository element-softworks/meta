'use client';

import { toast } from '@/components/ui/use-toast';
import { useEffect, useState, useTransition } from 'react';

/**
 * A custom hook to handle query requests.
 * @param queryFn The function to execute the query.
 * @returns An object with the query function, status, data, and loading state.
 * @description This hook will also display a toast notification based on the response.
 */

// Generic type T for input values and R for response type
export function useQuery<T, R>({
	queryFn,
	onCompleted,
	onSuccess,
	onError,
	enabled = true,
}: {
	queryFn: (values?: T) => Promise<any>;
	onCompleted?: (data?: { success?: string; error?: string } & R) => void;
	onSuccess?: (data?: { success?: string; error?: string } & R) => void;
	onError?: (data?: { success?: string; error?: string } & R) => void;
	enabled?: boolean;
}) {
	type QueryResponse = { success?: string; error?: string } & R;

	const [queryStatus, setQueryStatus] = useState<'error' | 'success' | 'idle'>('idle');
	const [data, setData] = useState<QueryResponse | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!data) return;

		onCompleted?.(data);
		if (data?.success) onSuccess?.(data);
		if (data?.error) onError?.(data);
	}, [data]);

	useEffect(() => {
		if (!enabled || data) return;
		(async () => {
			await query();
		})();
	}, [enabled]);

	const query = async (values?: T) => {
		let response: QueryResponse;

		await startTransition(async () => {
			try {
				// Execute the queryFn within the transition
				const responseData = await queryFn(values).then((res) => {
					response = res as QueryResponse;
					setData(response);

					if (response?.success) setQueryStatus('success');
					else setQueryStatus('error');

					if (!!response?.error || !!response?.success) {
						toast({
							description:
								response?.error ?? response?.success ?? 'An error occurred.',
							variant: response?.error ? 'destructive' : 'default',
						});
					}

					return response;
				});
			} catch (error) {
				setQueryStatus('error');
				toast({
					description: 'An unexpected error occurred.',
					variant: 'destructive',
				});
			}
		});
	};

	return { status: queryStatus, data, isLoading: queryStatus === 'idle' || isPending };
}
