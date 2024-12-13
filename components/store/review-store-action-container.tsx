import { StoreResponse } from '@/actions/store/get-store-by-id';
import { ReviewStoreAction } from './review-store-action';
import { PolicyQuestionsResponse, getPolicyQuestions } from '@/actions/policy/get-policy-questions';

export interface ReviewStoreActionContainerProps {
	store?: StoreResponse;
}

export async function ReviewStoreActionContainer(props: ReviewStoreActionContainerProps) {
	const questionResponse = (await await getPolicyQuestions(
		props?.store?.linkedPolicy?.id ?? '',
		10000,
		1,
		'',
		false
	)) as PolicyQuestionsResponse;

	return (
		<>
			<ReviewStoreAction store={props.store} questions={questionResponse} />
		</>
	);
}
