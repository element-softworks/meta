import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		revalidateTag('post');
		return NextResponse.json({
			status: 200,
			revalidated: true,
			now: Date.now(),
		});
	} catch (error: any) {
		console.error(error);
		return new Response(error.message, { status: 500 });
	}
}
