import { cancelCoachBooking } from '@/actions/booking-system/cancel-coach-booking';
import { createCoachBooking } from '@/actions/booking-system/create-coach-booking';
import { getCoachBookings } from '@/actions/booking-system/get-coach-bookings';
import { CoachBookingSchema } from '@/schemas/booking-system';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.json();

	const { searchParams } = new URL(req.url);
	const coachId = searchParams.get('coachId');

	const validatedFields = CoachBookingSchema.safeParse(values);

	if (!validatedFields.success) {
		NextResponse.json({
			error: 'An error occurred reviewing this coaches application, please try again later.',
		});
	}

	if (!coachId) {
		return NextResponse.json({
			error: 'An error occurred reviewing this coaches application, please try again later.',
		});
	}
	const response = await createCoachBooking(
		{
			...values,
			startDate: new Date(values.startDate),
			endDate: new Date(values.endDate),
		},
		coachId!
	);

	return NextResponse.json(response);
}

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const coachId = searchParams.get('coachId');
	const perPage = searchParams.get('perPage');
	const pageNum = searchParams.get('pageNum');
	const showCancelled = searchParams.get('showCancelled');

	if (!coachId) {
		return NextResponse.json({
			error: 'An error occurred reviewing this coaches application, please try again later.',
		});
	}
	const response = await getCoachBookings(
		coachId!,
		Number(perPage),
		Number(pageNum),
		showCancelled === 'true'
	);

	return NextResponse.json(response);
}

export async function DELETE(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const bookingId = searchParams.get('bookingId');

	if (!bookingId) {
		return NextResponse.json({
			error: 'Must include a bookingId to cancel a booking',
		});
	}

	const response = await cancelCoachBooking(bookingId!);

	return NextResponse.json(response);
}
