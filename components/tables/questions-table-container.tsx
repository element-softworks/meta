'use server';

import { QuestionResponse, getQuestions } from '@/actions/question-and-answers/get-questions';
import { QuestionsTable } from './questions-table';

interface QuestionsTableContainerProps {
	searchParams: any;
}
export default async function QuestionsTableContainer(props: QuestionsTableContainerProps) {
	// Get the filters from the search params

	const questionsResponse = (await getQuestions(
		Number(props.searchParams?.['questions-perPage'] ?? '100'),
		Number(props.searchParams?.['questions-pageNum'] ?? '1'),
		props.searchParams?.['questions-search'] ?? '',
		props.searchParams?.['questions-archived'] === 'true'
	)) as QuestionResponse;

	//Render the users table
	return (
		<QuestionsTable
			questions={questionsResponse?.questions ?? []}
			totalPages={questionsResponse?.totalPages}
			isLoading={false}
		/>
	);
}
