import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	console.log('revalidate post tag data...');
	try {
		revalidateTag('post');
		revalidatePath('/blog');
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
