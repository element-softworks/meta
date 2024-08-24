'use client';

import { toast } from '@/components/ui/use-toast';
import { useState, useTransition } from 'react';

/**
 * A custom hook to handle query requests.
 * @param queryFn The function to execute the query.
 * @returns An object with the query function, status, data, and loading state.
 * @description This hook will also display a toast notification based on the response.
 */

// Generic type T for input values and R for response type
export function useQuery<T, R>({ queryFn }: { queryFn: (values?: T) => Promise<any> }) {
	type QueryResponse = { success?: string; error?: string } & R;

	const [queryStatus, setQueryStatus] = useState<'error' | 'success'>();
	const [data, setData] = useState<QueryResponse>();
	const [isPending, startTransition] = useTransition();

	const query = async (values?: T | undefined) => {
		let response: QueryResponse;

		startTransition(() => {
			// Execute the queryFn within the transition
			queryFn(values).then((res) => {
				response = res as QueryResponse;
				if (response?.success) setQueryStatus('success');
				else setQueryStatus('error');

				if (!!response?.error || !!response?.success) {
					toast({
						description: response?.error ?? response?.success ?? 'An error occurred.',
						variant: response?.error ? 'destructive' : 'default',
					});
				}

				setData(response);
			});

			return; // This ensures the callback returns void
		});

		return;
	};

	return { query, status: queryStatus, data, isLoading: isPending };
}
