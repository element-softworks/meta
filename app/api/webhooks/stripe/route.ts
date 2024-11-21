import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: Response) {
	const rawBody = await req.text();

	return NextResponse.json({ received: true });
}
