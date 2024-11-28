'use server';

import { AnswersResponse, getAnswers } from '@/actions/question-and-answers/get-answers';
import { AnswersTable } from './answers-table';

interface AnswersTableContainerProps {
	searchParams: any;
	questionId: string;
}
export default async function AnswersTableContainer(props: AnswersTableContainerProps) {
	// Get the filters from the search params

	const answersResponse = (await getAnswers(
		Number(props.searchParams?.['answers-perPage'] ?? '100'),
		Number(props.searchParams?.['answers-pageNum'] ?? '1'),
		props.searchParams?.['answers-search'] ?? '',
		props.searchParams?.['answers-archived'] === 'true',
		props.questionId
	)) as AnswersResponse;

	//Render the users table
	return (
		<AnswersTable
			answers={answersResponse?.answers ?? []}
			totalPages={answersResponse?.totalPages}
			isLoading={false}
		/>
	);
}
