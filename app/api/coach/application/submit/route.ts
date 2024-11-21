import { coachApplicationSubmit } from '@/actions/booking-system/coach-application-submit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const response = await coachApplicationSubmit();

	return NextResponse.json(response);
}
