'use server';

import { QuestionResponse, getQuestions } from '@/actions/question-and-answers/get-questions';
import { QuestionsTable } from './questions-table';
import { CreatePolicyAction } from '../policies/create-policy-action';
import { PoliciesTable } from './policies-table';

interface PoliciesTableContainerProps {
	searchParams: any;
}
export default async function PoliciesTableContainer(props: PoliciesTableContainerProps) {
	// Get the filters from the search params

	const questionsResponse = (await getQuestions(
		Number(props.searchParams?.['policies-perPage'] ?? '100'),
		Number(props.searchParams?.['policies-pageNum'] ?? '1'),
		props.searchParams?.['policies-search'] ?? '',
		props.searchParams?.['policies-archived'] === 'true'
	)) as QuestionResponse;

	//Render the users table
	return (
		<>
			<PoliciesTable
				policies={questionsResponse?.questions ?? []}
				totalPages={questionsResponse?.totalPages}
				totalPolicies={questionsResponse?.total ?? 0}
				isLoading={false}
			/>
		</>
	);
}
