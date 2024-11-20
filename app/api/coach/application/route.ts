import { coachApplicationStart } from '@/actions/booking-system/coach-application-start';
import { coachApplicationUpdate } from '@/actions/booking-system/coach-application-update';
import { getCoachApplication } from '@/actions/booking-system/get-coach-application';
import { getCoachApplications } from '@/actions/booking-system/get-coach-applications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams?.get('perPage') ?? '10';
	const pageNum = searchParams?.get('pageNum') ?? '1';
	const status = searchParams?.get('status');
	console.log('yes cheeeeeee1 ');

	if (!searchParams?.get('perPage')?.length || !searchParams?.get('pageNum')?.length) {
		console.log('yes cheeeeeee');
		const application = await getCoachApplication(searchParams?.get('appId') as string);
		return NextResponse.json(application);
	}

	const response = await getCoachApplications(
		perPage,
		pageNum,
		status as 'PENDING' | 'APPROVED' | 'REJECTED'
	);

	return NextResponse.json(response);
}

export async function POST(req: NextRequest, res: Response) {
	const response = await coachApplicationStart();

	return NextResponse.json(response);
}

export async function PUT(req: NextRequest, res: Response) {
	const response = await coachApplicationUpdate(req?.body as any);

	return NextResponse.json(response);
}
