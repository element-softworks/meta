'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 *
 * @param {string} param - The query parameter to update/set
 * @param {string} value - The value to set the query parameter to
 * @returns mutateParam - A function to update the query parameter
 * @description A hook to update a query parameter in the URL
 */

export function useParam() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams]
	);

	const mutateParam = ({ param, value }: { param: string; value: string }) => {
		router.push(pathname + '?' + createQueryString(param, value));
	};

	return { mutateParam };
}
