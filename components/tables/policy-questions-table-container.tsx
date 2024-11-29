'use server';

import { PoliciesResponse, getPolicies } from '@/actions/policy/get-policies';
import { PoliciesTable } from './policies-table';
import { PolicyQuestionsResponse, getPolicyQuestions } from '@/actions/policy/get-policy-questions';
import { PolicyQuestionsTable } from './policy-questions-table';

interface PolicyQuestionsTableContainerProps {
	searchParams: any;
	policyId: string;
}
export default async function PolicyQuestionsTableContainer(
	props: PolicyQuestionsTableContainerProps
) {
	// Get the filters from the search params

	const policiesResponse = (await getPolicyQuestions(
		props.policyId ?? '',
		Number(props.searchParams?.['questions-perPage'] ?? '100'),
		Number(props.searchParams?.['questions-pageNum'] ?? '1'),
		props.searchParams?.['questions-search'] ?? '',
		props.searchParams?.['questions-archived'] === 'true'
	)) as PolicyQuestionsResponse;

	//Render the users table
	return (
		<>
			<PolicyQuestionsTable
				questions={policiesResponse?.questions ?? []}
				totalPages={policiesResponse?.totalPages}
				isLoading={false}
			/>
		</>
	);
}
