import { getFixtureTypeCategories } from '@/actions/fixture-type-categories/get-fixture-type-categories';
import { NextRequest, NextResponse } from 'next/server';

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

	const response = await getFixtureTypeCategories(
		Number(perPage),
		Number(pageNum),
		search ?? undefined,
		showArchived === 'true'
	);

	return NextResponse.json({ success: true, data: response });
}