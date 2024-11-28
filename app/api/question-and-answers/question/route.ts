import { getQuestionById } from '@/actions/question-and-answers/get-question-by-id';
import { getQuestions } from '@/actions/question-and-answers/get-questions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams.get('perPage');
	const pageNum = searchParams.get('pageNum');
	const showArchived = searchParams.get('showArchived');
	const search = searchParams.get('search');
	const questionId = searchParams.get('questionId');

	if (!perPage || !pageNum) {
		if (!questionId) {
			return NextResponse.json({
				error: 'perPage and pageNum or questionId are required',
			});
		}

		const response = await getQuestionById(questionId);

		return NextResponse.json({ ...response });
	}

	const response = await getQuestions(
		Number(perPage),
		Number(pageNum),
		search ?? undefined,
		showArchived === 'true'
	);

	return NextResponse.json(response);
}
