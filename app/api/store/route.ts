import { createStore } from '@/actions/store/create-store';
import { getStores } from '@/actions/store/get-stores';
import { formDataToNestedObject } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.formData();

	const parsedValues = formDataToNestedObject(values);

	const response = await createStore({
		...parsedValues,

		name: parsedValues.name,
		address: parsedValues.address,
		boundingBox: parsedValues?.boundingBox?.map((item: string[]) => item.map((i) => Number(i))),
		image: parsedValues.image,
		latitude: Number(parsedValues.latitude),
		longitude: Number(parsedValues.longitude),
		openingTimes: parsedValues.openingTimes,
		zoom: Number(parsedValues.zoom),
		maxCapacity: Number(parsedValues.maxCapacity),
		contactEmail: parsedValues.contactEmail,
		contactPhone: parsedValues.contactPhone,
	});

	return NextResponse.json({ success: true, data: response });
}

export async function GET(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const perPage = searchParams.get('perPage');
	const pageNum = searchParams.get('pageNum');

	if (!perPage) {
		return NextResponse.json({
			error: 'perPage is required',
		});
	}
	if (!pageNum) {
		return NextResponse.json({
			error: 'pageNum is required',
		});
	}

	const response = await getStores(Number(perPage), Number(pageNum));

	return NextResponse.json({ success: true, data: response });
}
