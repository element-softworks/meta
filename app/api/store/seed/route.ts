import { seedStores } from '@/actions/store/seed-stores';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const { searchParams } = new URL(req.url);

	try {
		const response = await seedStores();

		return NextResponse.json({ success: 'Stores seeded successfully' });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}
