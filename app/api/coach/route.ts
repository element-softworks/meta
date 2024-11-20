// import { createCoach } from '@/actions/booking-system/create-coach';
import { getAllCoaches } from '@/actions/booking-system/get-all-coaches';
import { CreateCoachSchema } from '@/schemas/booking-system';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.json();

	const validatedFields = CreateCoachSchema.safeParse(values);

	if (!validatedFields.success) {
		return {
			error: 'An error occurred creating the coach, please try again later.',
		};
	}

	// const response = await createCoach(values);

	// return NextResponse.json(response);
}

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams?.get('perPage') ?? '10';
	const pageNum = searchParams?.get('pageNum') ?? '1';

	const response = await getAllCoaches(perPage, pageNum);

	return NextResponse.json(response);
}
