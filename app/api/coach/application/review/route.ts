import { reviewCoachApplication } from '@/actions/booking-system/review-coach-application';
import { ReviewCoachApplicationSchema } from '@/schemas/booking-system';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.json();
	const { searchParams } = new URL(req.url);
	const applicationId = searchParams.get('applicationId');

	const validatedFields = ReviewCoachApplicationSchema.safeParse(values);

	if (!validatedFields.success) {
		NextResponse.json({
			error: 'An error occurred reviewing this coaches application, please try again later.',
		});
	}

	if (!applicationId) {
		NextResponse.json({
			error: 'An error occurred reviewing this coaches application, please try again later.',
		});
	}

	const response = await reviewCoachApplication(values, applicationId!);

	return NextResponse.json(response);
}
