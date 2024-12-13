import { seedFixtureTypeCategories } from '@/actions/fixture-type-categories/seed-fixture-type-categories';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);

	try {
		const response = await seedFixtureTypeCategories();

		return NextResponse.json({ success: 'Categories seeded successfully' });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}
