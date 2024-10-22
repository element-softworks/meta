import { getCoachApplications } from '@/actions/booking-system/get-coach-applications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams?.get('perPage') ?? '10';
	const pageNum = searchParams?.get('pageNum') ?? '1';
	const status = searchParams?.get('status');

	const response = await getCoachApplications(
		perPage,
		pageNum,
		status as 'PENDING' | 'APPROVED' | 'REJECTED'
	);

	return NextResponse.json(response);
}
