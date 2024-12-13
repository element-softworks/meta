import { seedQuestionAndAnswers } from '@/actions/question-and-answers/seed-question-and-answers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);

	try {
		const response = await seedQuestionAndAnswers();

		return NextResponse.json({ ...response });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}
