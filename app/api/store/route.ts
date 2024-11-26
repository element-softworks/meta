import { createStore } from '@/actions/store/create-store';
import { getStores } from '@/actions/store/get-stores';
import { formDataToNestedObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: NextRequest, res: Response) {
	const values = await req.formData();

	const parsedValues = formDataToNestedObject(values);

	try {
		const response = await createStore({
			...parsedValues,
			name: parsedValues.name,
			address: parsedValues.address,
			boundingBox: parsedValues?.boundingBox?.map((item: string[]) =>
				item.map((i) => Number(i))
			),
			image: [parsedValues.image] as any,
			latitude: Number(parsedValues.latitude),
			longitude: Number(parsedValues.longitude),
			openingTimes: parsedValues.openingTimes,
			zoom: Number(parsedValues.zoom),
			maxCapacity: String(parsedValues.maxCapacity),
			contactEmail: parsedValues.contactEmail,
			contactPhone: parsedValues.contactPhone,
		});

		revalidatePath('/dashboard/stores');

		if (!!response?.error) {
			return NextResponse.json({ error: 'An error occurred creating the store.' });
		} else {
			return NextResponse.json({ ...response });
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
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
