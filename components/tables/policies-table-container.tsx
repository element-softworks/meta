'use server';

import { PoliciesResponse, getPolicies } from '@/actions/policy/get-policies';
import { PoliciesTable } from './policies-table';

interface PoliciesTableContainerProps {
	searchParams: any;
}
export default async function PoliciesTableContainer(props: PoliciesTableContainerProps) {
	// Get the filters from the search params

	const policiesResponse = (await getPolicies(
		Number(props.searchParams?.['policies-perPage'] ?? '100'),
		Number(props.searchParams?.['policies-pageNum'] ?? '1'),
		props.searchParams?.['policies-search'] ?? '',
		props.searchParams?.['policies-archived'] === 'true'
	)) as PoliciesResponse;

	//Render the users table
	return (
		<>
			<PoliciesTable
				policies={policiesResponse?.policies ?? []}
				totalPages={policiesResponse?.totalPages}
				totalPolicies={policiesResponse?.total ?? 0}
				isLoading={false}
			/>
		</>
	);
}
