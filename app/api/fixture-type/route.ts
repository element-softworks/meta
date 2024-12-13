import { archiveFixtureTypes } from '@/actions/fixture-type/archive-fixture-types';
import { createFixtureType } from '@/actions/fixture-type/create-fixture-type';
import { getFixtureTypes } from '@/actions/fixture-type/get-fixture-types';
import { updateFixtureType } from '@/actions/fixture-type/update-fixture-type';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const values = await req.formData();

	const parasedFormData = new FormData();
	parasedFormData.append('name', String(values.get('name')));
	parasedFormData.append('description', String(values.get('description')));
	parasedFormData.append('images', values.get('image') as any);
	parasedFormData.append('category.id', String(values.get('category')));
	parasedFormData.append('category.label', 'label');

	try {
		const response: any = await createFixtureType(parasedFormData);

		if (!!response?.error) {
			return NextResponse.json({
				error: response?.error ?? 'An error occurred creating the fixture type.',
			});
		} else {
			return NextResponse.json({ ...response });
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}

export async function PUT(req: NextRequest, res: Response) {
	const urlParams = new URL(req.url).searchParams;
	const fixtureTypeId = urlParams.get('fixtureTypeId') ?? '';

	const values = await req.formData();

	const parasedFormData = new FormData();
	parasedFormData.append('name', String(values.get('name')));
	parasedFormData.append('description', String(values.get('description')));
	parasedFormData.append('images', values.get('image') as any);
	parasedFormData.append('id', fixtureTypeId);
	parasedFormData.append('category.id', String(values.get('category')));
	parasedFormData.append('category.label', 'label');

	try {
		const response: any = await updateFixtureType(parasedFormData);

		if (!!response?.error) {
			return NextResponse.json({
				error: response?.error ?? 'An error occurred creating the fixture type.',
			});
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
	const showArchived = searchParams.get('showArchived');
	const search = searchParams.get('search');

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

	const response = await getFixtureTypes(
		Number(perPage),
		Number(pageNum),
		search ?? undefined,
		showArchived === 'true'
	);

	return NextResponse.json({ success: true, data: response });
}

export async function DELETE(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);
	const fixtureIds = searchParams.get('fixtureIds');

	if (!fixtureIds?.length) {
		return NextResponse.json({
			error: 'fixtureIds is required',
		});
	}

	const formattedIds = fixtureIds?.split(',');

	const response = await archiveFixtureTypes(formattedIds);

	return NextResponse.json({ ...response });
}
