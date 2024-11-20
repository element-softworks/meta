import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { coachApplicationStart } from './actions/booking-system/coach-application-start';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	console.log('middleware running');
	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/auth/coach-setup',
};
