import { getScheduleByCoach } from '@/actions/booking-system/get-schedule-by-coach';
import { updateCoachSchedule } from '@/actions/booking-system/update-coach-schedule';
import { UpdateCoachScheduleSchema } from '@/schemas/booking-system';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, res: Response) {
	const values = await req.json();

	const validatedFields = UpdateCoachScheduleSchema.safeParse(values);

	const { searchParams } = new URL(req.url);
	const coachId = searchParams.get('coachId');

	if (!validatedFields.success) {
		return {
			error: 'An error occurred updating the coach schedule, please try again later.',
		};
	}

	if (!coachId) {
		return {
			error: 'No coach ID provided',
		};
	}

	const response = await updateCoachSchedule(values, coachId);

	return NextResponse.json(response);
}

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const coachId = searchParams?.get('coachId');

	if (!coachId) {
		return {
			error: 'No coach ID provided',
		};
	}

	const response = await getScheduleByCoach(coachId);

	return NextResponse.json(response);
}
